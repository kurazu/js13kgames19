import GeneticAlgorithm from './genetic';
import { SENSORS_COUNT, DEFAULT_LEVEL_LENGTH, DEFAULT_PLAYER_POSITION, FEATURES, LEARNING_FRAMES, DENSE_LAYERS } from '../constants';
import { ACTIONS } from '../physics/actions';
import { Layer, DenseLayer, ReluLayer, SigmoidLayer, SoftmaxLayer, FeedForwardNetwork } from '../math/net';
import { uniformRandom, range } from '../utils';


function createLayers(): Layer[] {
    const layers: Layer[] = [];
    for (const neuronsCount of DENSE_LAYERS) {
        layers.push(new DenseLayer(neuronsCount));
        layers.push(new SigmoidLayer());
    }
    layers.push(new DenseLayer(ACTIONS.length));
    layers.push(new SoftmaxLayer());
    return layers;
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

    protected mutateGene(gene: number): number {
        return gene + uniformRandom();
    }
}
