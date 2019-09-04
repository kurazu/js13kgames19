import GameNetworkGeneticOptimizer from './game_genetic';
import { FeedForwardNetwork } from './net';

export default function learn(): FeedForwardNetwork {
    const maxGenerations = 50;
    const populationSize = 100;
    const matingPoolSize = 10;
    const eliteSize = 3;
    const asexualReproductionSize = 3;
    const mutationFactor = 0.05;
    const minFrames = 60 * 20;
    const maxFrames = 60 * 200;
    const optimizer = new GameNetworkGeneticOptimizer(
        maxGenerations,
        populationSize,
        matingPoolSize,
        eliteSize,
        asexualReproductionSize,
        mutationFactor,
        minFrames,
        maxFrames,
    );
    return optimizer.evolveBest();
}

