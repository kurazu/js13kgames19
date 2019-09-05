import { Matrix2D, dot, addBias, relu, softmax, uniformRandomDistribution } from './multiply';
import { assert } from '../utils';

export abstract class Layer {
    public abstract getOutputSize(inputWidth: number): number;
    public abstract getWeightsSize(inputWidth: number): number;
    public abstract setWeights(inputWidth: number, weights: Float32Array): void;
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

    public getOutputSize(inputWidth: number): number {
        return this.width;
    }

    private getKernelSize(inputWidth: number): number {
        return inputWidth * this.width;
    }

    public getWeightsSize(inputWidth: number): number {
        return (
            // kernel
            this.getKernelSize(inputWidth) +
            // bias
            this.width
        );
    }

    public setWeights(inputWidth: number, weights: Float32Array): void {
        assert(weights.length === this.getWeightsSize(inputWidth));
        const kernelSize = this.getKernelSize(inputWidth);
        const kernelWeights = weights.subarray(0, kernelSize);
        const biasWeights = weights.subarray(kernelSize);
        this.kernel = new Matrix2D(inputWidth, this.width, kernelWeights);
        this.bias = new Float32Array(this.width)
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
}

abstract class ActivationLayer extends Layer {
    public getOutputSize(inputWidth: number): number {
        return inputWidth;
    }

    public getWeightsSize(inputWidth: number): number {
        return 0
    }

    public setWeights(inputWidth: number, weights: Float32Array): void {
        assert(weights.length === 0);
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
    public readonly weights: Float32Array;

    public constructor(inputWidth: number, layers: Layer[], weights: (Float32Array | null) = null) {
        this.layers = layers;
        this.inputWidth = inputWidth;

        const weightsSize = FeedForwardNetwork.getWeightsSize(inputWidth, layers);

        if (weights === null) {
            this.weights = new Float32Array(weightsSize);
            uniformRandomDistribution(this.weights);
        } else {
            assert(weights.length === weightsSize);
            this.weights = weights;
        }

        let fanIn = inputWidth;
        let weightsIndex = 0;
        for (const layer of this.layers) {
            const weightsSize = layer.getWeightsSize(fanIn);
            layer.setWeights(fanIn, this.weights.subarray(weightsIndex, weightsIndex + weightsSize));
            weightsIndex += weightsSize
            fanIn = layer.getOutputSize(fanIn);
        }
    }

    public static getWeightsSize(inputWidth: number, layers: Layer[]): number {
        let fanIn = inputWidth;
        let weightsSize = 0;
        for (const layer of layers) {
            weightsSize += layer.getWeightsSize(fanIn);
            fanIn = layer.getOutputSize(fanIn);
        }
        return weightsSize;
    }

    public calculate(inputMatrix: Matrix2D): Matrix2D {
        return this.layers.reduce((acc: Matrix2D, layer: Layer) => layer.calculate(acc), inputMatrix);
    }
}
