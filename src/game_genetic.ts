import GeneticAlgorithm from './genetic';
import { SENSORS_COUNT, DEFAULT_LEVEL_LENGTH, DEFAULT_PLAYER_POSITION, FEATURES, LEARNING_FRAMES } from './constants';
import { ACTIONS } from './actions';
import { Layer, DenseLayer, ReluLayer, SoftmaxLayer, FeedForwardNetwork } from './net';
import { uniformRandom, range } from './utils';
import World, { ShipAndPosition } from './world';
import generateLevel from './level_generator';
import AIShip from './ai_ship';

const VELOCITIES_COUNT = 2;
const INPUTS_WIDTH = SENSORS_COUNT + VELOCITIES_COUNT;

function createLayers(): Layer[] {
    return [
        new DenseLayer(128),
        new ReluLayer(),
        new DenseLayer(ACTIONS.length),
        new SoftmaxLayer()
    ];
}

export function createNetwork(buffer: Float32Array | null = null) {
    return new FeedForwardNetwork(FEATURES * LEARNING_FRAMES, createLayers(), buffer);
}

class PlayerScore {
    public readonly score: number;
    public readonly finished: boolean;

    public constructor(score: number, finished: boolean) {
        this.score = score;
        this.finished = finished;
    }

    public valueOf(): number {
        return this.score;
    }
}

export default class GameNetworkGeneticOptimizer extends GeneticAlgorithm<FeedForwardNetwork, PlayerScore> {
    private world: World;
    private minFrames: number;
    private maxFrames: number;
    private generationsWon: number[];
    private consecutiveWinsForEarlyStopping: number;

    public constructor(
        maxGenerations: number,
        populationSize: number,
        matingPoolSize: number,
        eliteSize: number,
        asexualReproductionSize: number,
        mutationFactor: number,
        minFrames: number,
        maxFrames: number,
        consecutiveWinsForEarlyStopping: number
    ) {
        super(maxGenerations, populationSize, matingPoolSize, eliteSize, asexualReproductionSize, mutationFactor);
        this.world = this.buildWorld();
        this.minFrames = minFrames;
        this.maxFrames = maxFrames;
        this.generationsWon = [];
        this.consecutiveWinsForEarlyStopping = consecutiveWinsForEarlyStopping;
    }

    private buildWorld(): World {
        const world = new World(DEFAULT_LEVEL_LENGTH);
        for (const [column, row] of generateLevel(DEFAULT_LEVEL_LENGTH)) {
            world.addBox(column, row);
        }
        return world;
    }

    protected createInitialSolution(): FeedForwardNetwork {
        return createNetwork();
    }

    protected evaluateFitness(population: FeedForwardNetwork[], generation: number): [FeedForwardNetwork, PlayerScore][] {
        const players = population.map(net => new AIShip(DEFAULT_PLAYER_POSITION, net));
        for (const player of players) {
            this.world.addShip(player);
        }

        const maxFrames = this.minFrames + (this.maxFrames - this.minFrames) * generation / (this.maxGenerations - 1);
        for (let frame = 0; frame < maxFrames; frame++) {
            const result: (ShipAndPosition[] | null) = this.world.update();
            if (result === null) { // nobody won yet
                continue;
            } else { // we have a winner
                console.log('Somebody won the race!');
                this.generationsWon.push(generation);
                break;
            }
        }
        return players.map(player => [
            player.neuralNetwork,
            new PlayerScore(player.position.x, player.position.x >= this.world.finishX)
        ]);
    }

    protected onGenerationEnd (generation: number, scoredPopulation: [FeedForwardNetwork, PlayerScore][]): boolean {
        const shouldTerminateEarly = super.onGenerationEnd(generation, scoredPopulation);
        if (range(this.consecutiveWinsForEarlyStopping).every(n => this.generationsWon[this.generationsWon.length - 1 - n] === generation - n)) {
            console.log(`${this.consecutiveWinsForEarlyStopping} last generations have won. Terminating early.`);
            return true;
        }
        if (scoredPopulation.some(([network, score]: [FeedForwardNetwork, PlayerScore]) => score.finished)) {
            console.log('Creating a new level');
            this.world = this.buildWorld();
        } else {
            this.world.reset();
        }
        return shouldTerminateEarly;
    }

    protected getGenes(solution: FeedForwardNetwork): Float32Array {
        return solution.weights;
    }

    protected constructSolution(genes: Float32Array): FeedForwardNetwork {
        return createNetwork(genes);
    }

    protected constructGene(geneIdx: number): number {
        return uniformRandom();
    }
}
