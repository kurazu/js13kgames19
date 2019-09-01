import { Matrix2D, dot, addBias, relu, softmax, uniformRandomDistribution } from './multiply';
// const hiddenLayerDefinition = require('./hidden.json');
// const outputLayerDefinition = require('./output.json');
// const inputData = require('./input.json');

export abstract class Layer {
    public abstract compile(inputWidth: number): number;
    public abstract calculate(inputMatrix: Matrix2D): Matrix2D;
    public abstract getWeights(): Iterable<Float32Array>;
    public abstract clone(): Layer;
}

export class DenseLayer extends Layer {
    private kernel!: Matrix2D;
    private bias!: Float32Array;
    private width: number;
    private stdDeviation!: number;

    public constructor(width: number) {
        super();
        this.width = width;
    }

    public compile(inputWidth: number): number {
        this.kernel = new Matrix2D(inputWidth, this.width);
        uniformRandomDistribution(this.kernel.buffer);
        this.bias = new Float32Array(this.width);
        uniformRandomDistribution(this.bias);
        return this.width;
    }

    public calculate(inputMatrix: Matrix2D): Matrix2D {
        return addBias(dot(inputMatrix, this.kernel), this.bias);
    }

    public *getWeights() {
        yield this.kernel.buffer;
        yield this.bias;
    }

    public clone(): DenseLayer {
        const copy = new DenseLayer(this.width);
        copy.kernel = new Matrix2D(this.kernel.rows, this.kernel.columns);
        copy.bias = new Float32Array(this.width);
        return copy;
    }
}

abstract class ActivationLayer extends Layer {
    public compile(inputWidth: number) {
        return inputWidth;
    }

    public *getWeights() {

    }

    public clone(): ActivationLayer {
        return this; /* activation layers are stateless, so no need to copy them. */
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
    public readonly inputWidth: number;

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

    public *getWeights(): Iterable<Float32Array> {
        for (const layer of this.layers) {
            yield* layer.getWeights();
        }
    }

    public clone(): FeedForwardNetwork {
        return new FeedForwardNetwork(this.inputWidth, this.layers.map(layer => layer.clone()));
    }
}

// const net = new FeedForwardNetwork([new DenseLayer(hiddenLayerDefinition), new ReluLayer(), new DenseLayer(outputLayerDefinition), new SoftmaxLayer()]);
// const input = new Matrix2D(1, 28 * 28);
// input.set(inputData);
// const result = net.calculate(input);
// console.log(result.toString());
