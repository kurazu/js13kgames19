import GeneticAlgorithm from './genetic';
import { SENSORS_COUNT, DEFAULT_LEVEL_LENGTH, DEFAULT_PLAYER_POSITION, FEATURES, LEARNING_FRAMES } from '../constants';
import { ACTIONS } from '../physics/actions';
import { Layer, DenseLayer, ReluLayer, SoftmaxLayer, FeedForwardNetwork } from '../math/net';
import { uniformRandom, range } from '../utils';


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

export default abstract class NeuralGeneticAlgorithm<Score> extends GeneticAlgorithm<FeedForwardNetwork, Score> {
    protected createInitialSolution(): FeedForwardNetwork {
        return createNetwork();
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
