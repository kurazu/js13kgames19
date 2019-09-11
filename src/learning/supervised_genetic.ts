import NeuralGeneticAlgorithm from './neural_genetic';
import { FeedForwardNetwork, getCrossCategoricalEntropyLoss } from '../math/net';
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

class SupervisedScore {
    public accuracy: number;
    public loss: number;

    public constructor(accuracy: number, loss: number) {
        this.accuracy = accuracy;
        this.loss = loss;
    }

    valueOf(): number {
        return -this.loss;
    }
}

export default class SupervisedGeneticOptimizer extends NeuralGeneticAlgorithm<SupervisedScore> {
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

    private evaluate(network: FeedForwardNetwork): SupervisedScore {
        const outputs: Matrix2D = network.calculate(this.inputs);

        const predictions = argmax2D(outputs);
        const accuracy = getMatchingAccuracy(predictions, this.labels);
        const loss = getCrossCategoricalEntropyLoss(outputs, this.labels);

        return new SupervisedScore(accuracy, loss);
    }

    protected evaluateFitness(population: FeedForwardNetwork[], generation: number): [FeedForwardNetwork, SupervisedScore][] {
        return population.map((network: FeedForwardNetwork) => [network, this.evaluate(network)]);
    }

    protected onGenerationEnd(generation: number, bestSolution: FeedForwardNetwork, bestScore: SupervisedScore): boolean {
        const shouldTerminateEarly = super.onGenerationEnd(generation, bestSolution, bestScore);
        console.log(`Generation ${generation} loss ${bestScore.loss} acc ${bestScore.accuracy}`);
        return shouldTerminateEarly || bestScore.accuracy > this.expectedAccuracy;
    }
}
