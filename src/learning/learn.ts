import GameNetworkGeneticOptimizer, { GenerationEndCallbackType } from './game_genetic';
import { FeedForwardNetwork } from '../math/net';

export default function learn(callback: GenerationEndCallbackType): FeedForwardNetwork {
    const maxGenerations = 100;
    const populationSize = 100;
    const matingPoolSize = 10;
    const eliteSize = 3;
    const asexualReproductionSize = 3;
    const mutationFactor = 0.05;
    const minFrames = 60 * 5;
    const maxFrames = 60 * 20;
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
        callback
    );
    return optimizer.evolveBest();
}

