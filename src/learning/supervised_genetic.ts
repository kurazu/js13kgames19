import NeuralGeneticAlgorithm from './neural_genetic';
import { FeedForwardNetwork } from '../math/net';
import { Matrix2D, argmax2D } from '../math/multiply';
import { getRandomSubset } from './batch';
import { getMatchingAccuracy, getCrossCategoricalEntropyLoss, oneHotEncode } from './loss';
import { ACTIONS } from '../physics/actions';

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
    private readonly inputs: Matrix2D;
    private readonly labels: Matrix2D;
    private readonly batchSize: number | undefined;

    public constructor(
        maxGenerations: number,
        populationSize: number,
        matingPoolSize: number,
        eliteSize: number,
        asexualReproductionSize: number,
        mutationFactor: number,
        inputs: Matrix2D,
        labels: Uint8Array,
        batchSize: number | undefined = undefined,
    ) {
        super(maxGenerations, populationSize, matingPoolSize, eliteSize, asexualReproductionSize, mutationFactor);
        this.inputs = inputs;
        this.labels = oneHotEncode(labels, ACTIONS.length);
        this.batchSize = batchSize;
    }

    private evaluate(network: FeedForwardNetwork, inputs: Matrix2D, labels: Matrix2D): SupervisedScore {
        const outputs: Matrix2D = network.calculate(inputs);

        const accuracy = getMatchingAccuracy(outputs, labels);
        const loss = getCrossCategoricalEntropyLoss(outputs, labels);

        return new SupervisedScore(accuracy, loss);
    }

    protected evaluateFitness(population: FeedForwardNetwork[], generation: number): [FeedForwardNetwork, SupervisedScore][] {
        let inputsSubset: Matrix2D;
        let labelsSubset: Matrix2D;
        if (this.batchSize === undefined) {
            [inputsSubset, labelsSubset] = [this.inputs, this.labels];
        } else {
            [inputsSubset, labelsSubset] = getRandomSubset(this.inputs, this.labels, this.batchSize);
        }
        return population.map((network: FeedForwardNetwork) => [network, this.evaluate(network, inputsSubset, labelsSubset)]);
    }

    protected onGenerationEnd(generation: number, bestSolution: FeedForwardNetwork, bestScore: SupervisedScore): void {
        super.onGenerationEnd(generation, bestSolution, bestScore);
        console.log(`Generation ${generation + 1} loss=${bestScore.loss} acc=${bestScore.accuracy}`);
    }

    protected isSatisfactory(generation: number, bestSolution: FeedForwardNetwork, bestScore: SupervisedScore): boolean {
        return false;
    }
}
