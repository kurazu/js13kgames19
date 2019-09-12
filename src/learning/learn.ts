import SupervisedGeneticOptimizer from './supervised_genetic';
import UnsupervisedGameGeneticOptimizer from './unsupervised_genetic';
import { FeedForwardNetwork } from '../math/net';
import { Matrix2D } from '../math/multiply';
import { FEATURES, LEARNING_FRAMES, SUPERVISED_GENERATIONS, UNSUPERVISED_GENERATIONS } from '../constants';

export function getInitializedUnsupervisedOptimizer(network: FeedForwardNetwork): UnsupervisedGameGeneticOptimizer {
    const maxGenerations = UNSUPERVISED_GENERATIONS;
    const populationSize = 100;
    const matingPoolSize = 10;
    const eliteSize = 3;
    const asexualReproductionSize = 3;
    const mutationFactor = 0.05;
    const minFrames = 60 * 10;
    const maxFrames = 60 * 60;
    const consecutiveWinsForEarlyStopping = 5;
    const optimizer = new UnsupervisedGameGeneticOptimizer(
        maxGenerations,
        populationSize,
        matingPoolSize,
        eliteSize,
        asexualReproductionSize,
        mutationFactor,
        minFrames,
        maxFrames,
        network
    );
    return optimizer;
}

export function getSupervisedOptimizer(inputs: Float32Array, labels: Uint8Array): SupervisedGeneticOptimizer {
    const maxGenerations = SUPERVISED_GENERATIONS;
    const populationSize = 100;
    const matingPoolSize = 10;
    const eliteSize = 3;
    const asexualReproductionSize = 3;
    const mutationFactor = 0.05;
    const batchSize = 2000;
    const inputMatrix = new Matrix2D(labels.length, FEATURES * LEARNING_FRAMES, inputs);
    const optimizer = new SupervisedGeneticOptimizer(
        maxGenerations,
        populationSize,
        matingPoolSize,
        eliteSize,
        asexualReproductionSize,
        mutationFactor,
        inputMatrix,
        labels,
        batchSize
    );
    return optimizer;
}
