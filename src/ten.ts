import tf from '@tensorflow/tfjs-node';
// const tf = require('@tensorflow/tfjs-node');
import { FEATURES, LEARNING_FRAMES } from './constants';
import { readFileSync } from 'fs';
import { assertEqual, range } from './utils';
import { Matrix2D } from './math/multiply';
import { ACTIONS } from './physics/actions';
import { shuffleArrays } from './learning/shuffle';


function getModel(): tf.Sequential {
    // Train a simple model:
    const model = tf.sequential();
    model.add(tf.layers.dense({units: 512, activation: 'sigmoid', inputShape: [FEATURES * LEARNING_FRAMES]}));
    model.add(tf.layers.dense({units: ACTIONS.length, activation: 'softmax'}));
    model.compile({optimizer: 'sgd', loss: 'categoricalCrossentropy', metrics: ['accuracy']});
    return model;
}

function readData(): [Float32Array, Float32Array, number] {
    const rows = 3097;
    const path = '/home/kurazu/Downloads/samples.1568108766129.3097.bin';
    const buffer: ArrayBuffer = readFileSync(path).buffer;
    const featuresSize = FEATURES * LEARNING_FRAMES * rows * 4;
    const inputsBuffer = buffer.slice(0, featuresSize);
    const labelsBuffer = buffer.slice(featuresSize);
    const inputsArray = new Float32Array(inputsBuffer);
    const labelsArray = new Uint8Array(labelsBuffer);
    const oneHotLabels = new Float32Array(ACTIONS.length * rows);
    for (const [row, column] of labelsArray.entries()) {
        oneHotLabels[row * ACTIONS.length + column] = 1;
    }

    assertEqual(inputsArray.length / (FEATURES * LEARNING_FRAMES), rows);
    assertEqual(labelsArray.length, rows);
    return [inputsArray, oneHotLabels, rows];
}

function train(inputsArray: Float32Array, oneHotLabels: Float32Array, rows: number) {
    const xs = tf.tensor(inputsArray, [rows, FEATURES * LEARNING_FRAMES]);
    const ys = tf.tensor(oneHotLabels, [rows, ACTIONS.length]);

    const model = getModel();

    model.fit(xs, ys, {
      epochs: 300,
      validationSplit: 0.2,
      batchSize: 64,
      callbacks: {
        onEpochEnd: (epoch: number, log: any) => { console.log(`Epoch ${epoch}: loss = ${log.loss}`); }
      }
    }).then(info => {
        console.log('Final accuracy', info.history.val_acc);
    });
}

function main() {
    const [inputs, labels, rows] = readData();
    const [shuffledInputs, shuffledLabels] = shuffleArrays(inputs, labels, rows);
    train(shuffledInputs, shuffledLabels, rows);
}

main();
