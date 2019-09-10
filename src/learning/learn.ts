import GameNetworkGeneticOptimizer from './game_genetic';
import SupervisedGeneticOptimizer from './supervised_genetic';
import { FeedForwardNetwork } from '../math/net';
import { Matrix2D } from '../math/multiply';
import { FEATURES, LEARNING_FRAMES } from '../constants';

export function getUnsupervisedOptimizer(): GameNetworkGeneticOptimizer {
    const maxGenerations = 1000;
    const populationSize = 100;
    const matingPoolSize = 10;
    const eliteSize = 3;
    const asexualReproductionSize = 3;
    const mutationFactor = 0.05;
    const minFrames = 60 * 5;
    const maxFrames = 60 * 5;
    const consecutiveWinsForEarlyStopping = 5;
    const optimizer = new GameNetworkGeneticOptimizer(
        maxGenerations,
        populationSize,
        matingPoolSize,
        eliteSize,
        asexualReproductionSize,
        mutationFactor,
        minFrames,
        maxFrames,
        consecutiveWinsForEarlyStopping,
    );
    return optimizer;
}

export function getSupervisedOptimizer(inputs: Float32Array, labels: Uint8Array): SupervisedGeneticOptimizer {
    const maxGenerations = 10;
    const populationSize = 100;
    const matingPoolSize = 10;
    const eliteSize = 3;
    const asexualReproductionSize = 3;
    const mutationFactor = 0.05;
    const expectedAccuracy = 0.9;
    const inputMatrix = new Matrix2D(labels.length, FEATURES * LEARNING_FRAMES, inputs);
    const optimizer = new SupervisedGeneticOptimizer(
        maxGenerations,
        populationSize,
        matingPoolSize,
        eliteSize,
        asexualReproductionSize,
        mutationFactor,
        expectedAccuracy,
        inputMatrix,
        labels
    );
    return optimizer;
}
