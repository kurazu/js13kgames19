import NeuralGeneticAlgorithm from './neural_genetic';
import { FeedForwardNetwork } from '../math/net';
import { Matrix2D, argmax2D, getMatchingAccuracy } from '../math/multiply';


export default class SupervisedGeneticOptimizer extends NeuralGeneticAlgorithm<number> {
    private expectedAccuracy: number;
    private inputs: Matrix2D;
    private labels: Uint8Array;

    public constructor(
        maxGenerations: number,
        populationSize: number,
        matingPoolSize: number,
        eliteSize: number,
        asexualReproductionSize: number,
        mutationFactor: number,
        expectedAccuracy: number,
        inputs: Matrix2D,
        labels: Uint8Array
    ) {
        super(maxGenerations, populationSize, matingPoolSize, eliteSize, asexualReproductionSize, mutationFactor);
        this.expectedAccuracy = expectedAccuracy;
        this.inputs = inputs;
        this.labels = labels;
    }

    private evaluateAccuracy(network: FeedForwardNetwork): number {
        const outputs: Matrix2D = network.calculate(this.inputs);
        const predictions = argmax2D(outputs);
        return getMatchingAccuracy(predictions, this.labels);
    }

    protected evaluateFitness(population: FeedForwardNetwork[], generation: number): [FeedForwardNetwork, number][] {
        return population.map((network: FeedForwardNetwork) => [network, this.evaluateAccuracy(network)]);
    }

    protected onGenerationEnd(generation: number, bestSolution: FeedForwardNetwork, bestScore: number): boolean {
        const shouldTerminateEarly = super.onGenerationEnd(generation, bestSolution, bestScore);
        return shouldTerminateEarly || bestScore > this.expectedAccuracy;
    }
}
