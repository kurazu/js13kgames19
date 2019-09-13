import NeuralGeneticAlgorithm from './neural_genetic';
import { FeedForwardNetwork } from '../math/net';
import { range } from '../utils';
import World, { ShipAndPosition } from '../physics/world';
import AIShip from '../ships/ai_ship';
import { UNSUPERVISED_MIN_FRAMES, UNSUPERVISED_MAX_FRAMES } from '../constants';


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

export default class UnsupervisedGameGeneticOptimizer extends NeuralGeneticAlgorithm<PlayerScore> {
    private world: World;
    private initialNetwork: FeedForwardNetwork;

    public constructor(
        maxGenerations: number,
        initialNetwork: FeedForwardNetwork
    ) {
        super(maxGenerations);
        this.world = new World();
        this.initialNetwork = initialNetwork;
    }

    protected evaluateFitness(population: FeedForwardNetwork[], generation: number): [FeedForwardNetwork, PlayerScore][] {
        const players = population.map(net => new AIShip(net, 0));
        for (const player of players) {
            this.world.addShip(player);
        }

        const maxFrames = UNSUPERVISED_MIN_FRAMES + (UNSUPERVISED_MAX_FRAMES - UNSUPERVISED_MIN_FRAMES) * generation / (this.maxGenerations - 1);
        for (let frame = 0; frame < maxFrames; frame++) {
            const result: (ShipAndPosition[] | null) = this.world.update();
            if (result === null) { // nobody won yet
                continue;
            } else { // we have a winner
                console.log('Somebody won the race!');
                break;
            }
        }
        return players.map(player => [
            player.neuralNetwork,
            new PlayerScore(player.position.x, player.position.x >= this.world.finishX)
        ]);
    }

    protected onGenerationEnd(generation: number, bestSolution: FeedForwardNetwork, bestScore: PlayerScore): void {
        super.onGenerationEnd(generation, bestSolution, bestScore);
        if (bestScore.finished) {
            console.log('Creating a new level');
            this.world = new World();
        } else {
            this.world.reset();
        }
    }

    protected isSatisfactory(generation: number, bestSolution: FeedForwardNetwork, bestScore: PlayerScore): boolean {
        return generation === this.maxGenerations - 1 || bestScore.finished || bestScore.score > 5000;
    }

    protected createInitialSolution(idx: number): FeedForwardNetwork {
        if (idx === 0) {
            return this.initialNetwork;
        } else {
            return super.createInitialSolution(idx);
        }
    }
}
