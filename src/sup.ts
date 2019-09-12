import { getSupervisedOptimizer } from './learning/learn';
import { getMatchingAccuracy, getCrossCategoricalEntropyLoss, oneHotEncode } from './learning/loss';
import { FEATURES, LEARNING_FRAMES } from './constants';
import { readFileSync } from 'fs';
import { Matrix2D, add, softmax } from './math/multiply';
import { FeedForwardNetwork } from './math/net';
import { ACTIONS } from './physics/actions';

const path = '/home/kurazu/Downloads/samples.1568211892615.14995.bin';
const rows = 14995;

const buffer: ArrayBuffer = readFileSync(path).buffer;
const featuresSize = FEATURES * LEARNING_FRAMES * rows * 4;
const inputsBuffer = buffer.slice(0, featuresSize);
const labelsBuffer = buffer.slice(featuresSize);
const inputsArray = new Float32Array(inputsBuffer);
const labelsArray = new Uint8Array(labelsBuffer);

const optimizer = getSupervisedOptimizer(inputsArray, labelsArray);
const networks: FeedForwardNetwork[] = optimizer.evolve();

function predictCouncil(networks: FeedForwardNetwork[], inputs: Matrix2D) {
    const results = networks.map(network => network.calculate(inputs));
    const combined = add(results);
    return softmax(combined);
}

const COUNCIL_SIZE = 10;
const council = networks.slice(0, COUNCIL_SIZE);
const inputMatrix = new Matrix2D(labelsArray.length, FEATURES * LEARNING_FRAMES, inputsArray);
const outputs = predictCouncil(council, inputMatrix);
const encodedLabels = oneHotEncode(labelsArray, ACTIONS.length);
const loss = getCrossCategoricalEntropyLoss(outputs, encodedLabels);
const acc = getMatchingAccuracy(outputs, encodedLabels);
console.log(`council loss=${loss} acc=${acc}`);
