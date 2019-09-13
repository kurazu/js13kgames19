import SupervisedGeneticOptimizer from './supervised_genetic';
import UnsupervisedGameGeneticOptimizer from './unsupervised_genetic';
import { FeedForwardNetwork } from '../math/net';
import { Matrix2D } from '../math/multiply';
import { FEATURES, LEARNING_FRAMES, SUPERVISED_GENERATIONS, UNSUPERVISED_GENERATIONS } from '../constants';

export function getInitializedUnsupervisedOptimizer(network: FeedForwardNetwork): UnsupervisedGameGeneticOptimizer {
    const maxGenerations = UNSUPERVISED_GENERATIONS;
    const optimizer = new UnsupervisedGameGeneticOptimizer(
        maxGenerations,
        network
    );
    return optimizer;
}

export function getSupervisedOptimizer(inputs: Float32Array, labels: Uint8Array): SupervisedGeneticOptimizer {
    const maxGenerations = SUPERVISED_GENERATIONS;
    const batchSize = 2000;
    const inputMatrix = new Matrix2D(labels.length, FEATURES * LEARNING_FRAMES, inputs);
    const optimizer = new SupervisedGeneticOptimizer(
        maxGenerations,
        inputMatrix,
        labels,
        batchSize
    );
    return optimizer;
}
