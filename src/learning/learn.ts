import GameNetworkGeneticOptimizer from './game_genetic';
import { FeedForwardNetwork } from '../math/net';

export default function getOptimizer(): GameNetworkGeneticOptimizer {
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
