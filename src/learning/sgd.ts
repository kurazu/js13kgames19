import { FeedForwardNetwork, Layer } from '../math/net';
import { assertEqual, reverse } from '../utils';
import { shuffleArrays } from './shuffle';
import { createNetwork } from './neural_genetic';
import { Matrix2D, argmax2D, multiplyByScalar } from '../math/multiply';
import { getBatches, trainTestSplit } from './batch';
import { getCrossCategoricalEntropyLoss, getMatchingAccuracy } from './loss';

export default class SGDOptimizer {
    private learningRate: number;
    private network: FeedForwardNetwork;
    private trainX: Matrix2D;
    private trainY: Matrix2D;
    private validationX: Matrix2D;
    private validationY: Matrix2D;
    private batchSize: number;
    private epochs: number;

    constructor(
        inputs: Matrix2D,
        labels: Matrix2D,
        epochs: number = 100,
        learningRate: number = 0.001,
        validationSplit: number = 0.2,
        batchSize: number = 32
    ) {
        this.network = createNetwork();
        this.epochs = epochs;
        this.learningRate = learningRate;
        this.batchSize = batchSize;
        [this.trainX, this.trainY, this.validationX, this.validationY] = trainTestSplit(inputs, labels, validationSplit);
    }

    public fit(): FeedForwardNetwork {
        for (let epoch = 1; epoch <= this.epochs; epoch++) {
            const tsBefore = +new Date;
            this.trainEpoch(epoch);
            const [loss, accurracy] = this.validate();
            const tsAfter = +new Date;
            const time = ((tsAfter - tsBefore) / 1000).toFixed(1);
            console.log(`Epoch ${epoch} val_loss=${loss} val_acc=${accurracy} took ${time}s`)
        }
        return this.network;
    }

    private trainBatch(batchX: Matrix2D, batchY: Matrix2D): void {
        const layersAndResults: [Layer, Matrix2D][] = [];
        let outputs: Matrix2D = batchX;
        for (const layer of this.network.layers) {
            outputs = layer.calculate(outputs);
            layersAndResults.push([layer, outputs]);
        }
        const totalLoss = getCrossCategoricalEntropyLoss(outputs, batchY);
        const lossPerItem = totalLoss / this.batchSize;

        for (const [layer, outputs] of layersAndResults) {
            const errorTerm = multiplyByScalar(layer.derivate(outputs), lossPerItem);
        }
    }

    private trainEpoch(epoch: number): void {
        for (const [batchX, batchY] of getBatches(this.trainX, this.trainY, this.batchSize)) {
            this.trainBatch(batchX, batchY);
        }
    }

    private validate(): [number, number] {
        const outputs: Matrix2D = this.network.calculate(this.validationX);

        const accuracy = getMatchingAccuracy(outputs, this.validationY);
        const loss = getCrossCategoricalEntropyLoss(outputs, this.validationY);
        return [loss, accuracy];
    }
}
