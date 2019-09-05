import GeneticAlgorithm from './genetic';
import { SENSORS_COUNT, DEFAULT_LEVEL_LENGTH, DEFAULT_PLAYER_POSITION, FEATURES, LEARNING_FRAMES } from '../constants';
import { ACTIONS } from '../physics/actions';
import { Layer, DenseLayer, ReluLayer, SoftmaxLayer, FeedForwardNetwork } from '../math/net';
import { uniformRandom, range } from '../utils';
import World, { ShipAndPosition } from '../physics/world';
import AIShip from '../ships/ai_ship';

const VELOCITIES_COUNT = 2;
const INPUTS_WIDTH = SENSORS_COUNT + VELOCITIES_COUNT;

function createLayers(): Layer[] {
    return [
        new DenseLayer(64),
        new ReluLayer(),
        new DenseLayer(16),
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
        consecutiveWinsForEarlyStopping: number,
    ) {
        super(maxGenerations, populationSize, matingPoolSize, eliteSize, asexualReproductionSize, mutationFactor);
        this.world = new World();
        this.minFrames = minFrames;
        this.maxFrames = maxFrames;
        this.generationsWon = [];
        this.consecutiveWinsForEarlyStopping = consecutiveWinsForEarlyStopping;
    }

    protected createInitialSolution(): FeedForwardNetwork {
        return createNetwork();
    }

    protected evaluateFitness(population: FeedForwardNetwork[], generation: number): [FeedForwardNetwork, PlayerScore][] {
        const players = population.map(net => new AIShip(net));
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
        const [bestSolution, ]: [FeedForwardNetwork, PlayerScore] = scoredPopulation[0];
        if (range(this.consecutiveWinsForEarlyStopping).every(n => this.generationsWon[this.generationsWon.length - 1 - n] === generation - n)) {
            console.log(`${this.consecutiveWinsForEarlyStopping} last generations have won. Terminating early.`);
            return true;
        }
        if (scoredPopulation.some(([network, score]: [FeedForwardNetwork, PlayerScore]) => score.finished)) {
            console.log('Creating a new level');
            this.world = new World();
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
