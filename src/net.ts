import { Matrix2D, dot, addBias, relu, softmax } from './multiply';
// const hiddenLayerDefinition = require('./hidden.json');
// const outputLayerDefinition = require('./output.json');
// const inputData = require('./input.json');

export abstract class Layer {
    public abstract calculate(inputMatrix: Matrix2D): Matrix2D;
}

interface KernelDefinition {
    shape: [number, number];
    value: number[][];
}

interface BiasDefinition {
    value: number[];
}

interface DenseLayerDefinition {
    kernel: KernelDefinition;
    bias: BiasDefinition;
}

export class DenseLayer extends Layer {
    private kernel: Matrix2D;
    private bias: number[];

    constructor(definition: DenseLayerDefinition) {
        super();
        const {kernel: {shape: [rows, columns], value: kernelValue}, bias: {value: biasValue}} = definition;
        this.kernel = new Matrix2D(rows, columns);
        this.kernel.set(kernelValue);
        this.bias = biasValue;
    }

    public calculate(inputMatrix: Matrix2D): Matrix2D {
        return addBias(dot(inputMatrix, this.kernel), this.bias);
    }
}

export class ReluLayer extends Layer {
    public calculate(inputMatrix: Matrix2D): Matrix2D {
        return relu(inputMatrix);
    }
}

export class SoftmaxLayer extends Layer {
    public calculate(inputMatrix: Matrix2D): Matrix2D {
        return softmax(inputMatrix);
    }
}

export class FeedForwardNetwork {
    private layers: Layer[];

    public constructor(layers: Layer[]) {
        this.layers = layers;
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
