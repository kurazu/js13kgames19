import NeuralGeneticAlgorithm from './neural_genetic';
import { FeedForwardNetwork } from '../math/net';
import { range } from '../utils';
import World, { ShipAndPosition } from '../physics/world';
import AIShip from '../ships/ai_ship';


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

export default class GameNetworkGeneticOptimizer extends NeuralGeneticAlgorithm<PlayerScore> {
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

    protected evaluateFitness(population: FeedForwardNetwork[], generation: number): [FeedForwardNetwork, PlayerScore][] {
        const players = population.map(net => new AIShip(net, 0));
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

    protected isReadyForEarlyStopping(generation: number): boolean {
        return range(this.consecutiveWinsForEarlyStopping).every(n => this.generationsWon[this.generationsWon.length - 1 - n] === generation - n);
    }

    protected onGenerationEnd(generation: number, bestSolution: FeedForwardNetwork, bestScore: PlayerScore): boolean {
        const shouldTerminateEarly = super.onGenerationEnd(generation, bestSolution, bestScore);
        if (this.isReadyForEarlyStopping(generation)) {
            console.log(`${this.consecutiveWinsForEarlyStopping} last generations have won. Terminating early.`);
            return true;
        }
        if (bestScore.finished) {
            console.log('Creating a new level');
            this.world = new World();
        } else {
            this.world.reset();
        }
        return shouldTerminateEarly;
    }

    protected isSatisfactory(generation: number, bestSolution: FeedForwardNetwork, bestScore: PlayerScore): boolean {
        return generation === this.maxGenerations - 1 || bestScore.score > 5000 || this.isReadyForEarlyStopping(generation);
    }
}
