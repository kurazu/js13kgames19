import { Matrix2D, dot, addBias, relu, softmax, uniformRandomDistribution } from './multiply';
// const hiddenLayerDefinition = require('./hidden.json');
// const outputLayerDefinition = require('./output.json');
// const inputData = require('./input.json');

export abstract class Layer {
    public abstract compile(inputWidth: number): number;
    public abstract calculate(inputMatrix: Matrix2D): Matrix2D;
}

export class DenseLayer extends Layer {
    private kernel!: Matrix2D;
    private bias!: Float32Array;
    private width: number;

    public constructor(width: number) {
        super();
        this.width = width;
    }

    public compile(inputWidth: number): number {
        this.kernel = new Matrix2D(inputWidth, this.width);
        // Kaiming He et. al.
        const stdDeviation = Math.sqrt(2 / inputWidth);
        uniformRandomDistribution(this.kernel.buffer, stdDeviation);
        this.bias = new Float32Array(this.width);
        // bias is initialized to zeroes
        return this.width;
    }

    public calculate(inputMatrix: Matrix2D): Matrix2D {
        return addBias(dot(inputMatrix, this.kernel), this.bias);
    }
}

abstract class ActivationLayer extends Layer {
    public compile(inputWidth: number) {
        return inputWidth;
    }
}

export class ReluLayer extends ActivationLayer {
    public calculate(inputMatrix: Matrix2D): Matrix2D {
        return relu(inputMatrix);
    }
}

export class SoftmaxLayer extends ActivationLayer {
    public calculate(inputMatrix: Matrix2D): Matrix2D {
        return softmax(inputMatrix);
    }
}

export class FeedForwardNetwork {
    private layers: Layer[];
    private inputWidth: number;

    public constructor(inputWidth: number, layers: Layer[]) {
        this.layers = layers;
        this.inputWidth = inputWidth;
    }

    public compile() {
        let fanIn = this.inputWidth;
        for (const layer of this.layers) {
            fanIn = layer.compile(fanIn);
        }
    }

    public calculate(inputMatrix: Matrix2D): Matrix2D {
        return this.layers.reduce((acc: Matrix2D, layer: Layer) => layer.calculate(acc), inputMatrix);
    }
}

// const net = new FeedForwardNetwork([new DenseLayer(hiddenLayerDefinition), new ReluLayer(), new DenseLayer(outputLayerDefinition), new SoftmaxLayer()]);
// const input = new Matrix2D(1, 28 * 28);
// input.set(inputData);
// const result = net.calculate(input);
// console.log(result.toString());
