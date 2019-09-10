import NeuralGeneticAlgorithm from './neural_genetic';
import { FeedForwardNetwork } from '../math/net';
import { Matrix2D, argmax2D, getMatchingAccuracy } from '../math/multiply';

function getHistogram(input: Uint8Array): Map<number, number> {
    const map: Map<number, number> = new Map();
    for (const i of input) {
        if (!map.has(i)) {
            map.set(i, 1);
        } else {
            map.set(i, map.get(i)! + 1);
        }
    }
    return map;
}

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

        const accuracy = getMatchingAccuracy(predictions, this.labels);

        console.log('PREDITIONS', getHistogram(predictions));
        console.log('accuracy', accuracy);
        return accuracy;
    }

    protected evaluateFitness(population: FeedForwardNetwork[], generation: number): [FeedForwardNetwork, number][] {
        return population.map((network: FeedForwardNetwork) => [network, this.evaluateAccuracy(network)]);
    }

    protected onGenerationEnd(generation: number, bestSolution: FeedForwardNetwork, bestScore: number): boolean {
        const shouldTerminateEarly = super.onGenerationEnd(generation, bestSolution, bestScore);
        return shouldTerminateEarly || bestScore > this.expectedAccuracy;
    }
}
