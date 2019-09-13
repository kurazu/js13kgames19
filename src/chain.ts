import { getSupervisedOptimizer, getInitializedUnsupervisedOptimizer } from './learning/learn';
import { FEATURES, LEARNING_FRAMES } from './constants';
import { readFileSync } from 'fs';
import { Matrix2D } from './math/multiply';


const path = '/home/kurazu/Downloads/samples.1568368536953.3303.bin';
const rows = 3303;

const buffer: ArrayBuffer = readFileSync(path).buffer;
const featuresSize = FEATURES * LEARNING_FRAMES * rows * 4;
const inputsBuffer = buffer.slice(0, featuresSize);
const labelsBuffer = buffer.slice(featuresSize);
const inputsArray = new Float32Array(inputsBuffer);
const labelsArray = new Uint8Array(labelsBuffer);

const network = getSupervisedOptimizer(inputsArray, labelsArray).evolveBest();
getInitializedUnsupervisedOptimizer(network).evolveBest();

