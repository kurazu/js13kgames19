import GameNetworkGeneticOptimizer from './game_genetic';
import { FeedForwardNetwork } from '../math/net';
import { createNetwork } from './neural_genetic';

export default class InitializedUnsupervisedGeneticOptimizer extends GameNetworkGeneticOptimizer {
    private initialNetwork: FeedForwardNetwork;

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
        initialNetwork: FeedForwardNetwork,
    ) {
        super(maxGenerations, populationSize, matingPoolSize, eliteSize, asexualReproductionSize, mutationFactor, minFrames, maxFrames, consecutiveWinsForEarlyStopping);
        this.initialNetwork = initialNetwork;
    }

    protected createInitialSolution(idx: number): FeedForwardNetwork {
        if (idx === 0) {
            return this.initialNetwork;
        } else {
            return super.createInitialSolution(idx);
        }
    }

}
