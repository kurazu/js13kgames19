import { getSupervisedOptimizer } from './learning/learn';
import { readFileSync } from 'fs';
import { FEATURES, LEARNING_FRAMES } from './constants';
import { assertEqual } from './utils';
import { Matrix2D } from './math/multiply';

const path = '/home/kurazu/Downloads/samples.1568108766129.3097.bin';
const rows = 3097;

const buffer: ArrayBuffer = readFileSync(path).buffer;
const featuresSize = FEATURES * LEARNING_FRAMES * rows * 4;
const inputsBuffer = buffer.slice(0, featuresSize);
const labelsBuffer = buffer.slice(featuresSize);
const inputsArray = new Float32Array(inputsBuffer);
const labelsArray = new Uint8Array(labelsBuffer);

assertEqual(inputsArray.length / (FEATURES * LEARNING_FRAMES), rows);
assertEqual(labelsArray.length, rows);

getSupervisedOptimizer(inputsArray, labelsArray).evolveBest();
