const {Matrix2D, dot, addBias, relu, softmax} = require('./multiply');
const hiddenLayerDefinition = require('./hidden.json');
const outputLayerDefinition = require('./output.json');
const inputData = require('./input.json');

class Layer {
    calculate(inputMatrix) {
        throw new Error("NotImplemented");
    }
}

class DenseLayer extends Layer {
    constructor(definition) {
        super();
        const {kernel: {shape: [rows, columns], value: kernelValue}, bias: {value: biasValue}} = definition;
        this.kernel = new Matrix2D(rows, columns);
        this.kernel.set(kernelValue);
        this.bias = biasValue;
    }

    calculate(inputMatrix) {
        return addBias(dot(inputMatrix, this.kernel), this.bias);
    }
}

class ReluLayer extends Layer {
    calculate(inputMatrix) {
        return relu(inputMatrix);
    }
}

class SoftmaxLayer extends Layer {
    calculate(inputMatrix) {
        return softmax(inputMatrix);
    }
}

class FeedForwardNetwork {
    constructor(layers) {
        this.layers = layers;
    }

    calculate(inputMatrix) {
        return this.layers.reduce((acc, layer) => layer.calculate(acc), inputMatrix);
    }
}

const net = new FeedForwardNetwork([new DenseLayer(hiddenLayerDefinition), new ReluLayer(), new DenseLayer(outputLayerDefinition), new SoftmaxLayer()]);
const input = new Matrix2D(1, 28 * 28);
input.set(inputData);
const result = net.calculate(input);
console.log(result.toString());
