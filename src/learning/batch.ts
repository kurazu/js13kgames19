import { Matrix2D } from '../math/multiply';
import { assertEqual, range, randomSample } from '../utils';
import { shuffle, shuffleArrays } from './shuffle';

export function* getBatches(x: Matrix2D, y: Matrix2D, batchSize: number): Iterable<[Matrix2D, Matrix2D]> {
    assertEqual(x.rows, y.rows);
    const rows = x.rows;
    const indices = range(rows);
    shuffle(indices);
    for (let idx = 0; idx < rows; idx += batchSize) {
        const batchX = new Matrix2D(batchSize, x.columns);
        const batchY = new Matrix2D(batchSize, y.columns);
        for (let offset = 0; offset < batchSize; offset++) {
            const sourceIdx = indices[idx + offset];
            batchX.setRow(offset, x.getRow(sourceIdx));
            batchY.setRow(offset, y.getRow(sourceIdx));
        }
        yield [batchX, batchY];
    }
}


export function trainTestSplit(inputs: Matrix2D, labels: Matrix2D, validationSplit: number): [Matrix2D, Matrix2D, Matrix2D, Matrix2D] {
    assertEqual(inputs.rows, labels.rows);
    const rows: number = inputs.rows;
    shuffleArrays(inputs.buffer, labels.buffer, rows);
    const trainRows = ~~(validationSplit * rows);
    const testRows = rows - trainRows;
    const trainX = new Matrix2D(trainRows, inputs.columns, inputs.buffer.subarray(0, trainRows * inputs.columns));
    const testX = new Matrix2D(testRows, inputs.columns, inputs.buffer.subarray(trainRows * inputs.columns));
    const trainY = new Matrix2D(trainRows, labels.columns, labels.buffer.subarray(0, trainRows * labels.columns));
    const testY = new Matrix2D(testRows, labels.columns, labels.buffer.subarray(trainRows * labels.columns));
    return [trainX, trainY, testX, testY];
}

export function getRandomSubset(inputs: Matrix2D, labels: Matrix2D, size: number): [Matrix2D, Matrix2D] {
    assertEqual(inputs.rows, labels.rows);
    const rows: number = inputs.rows;
    if (rows <= size) {
        // set too small
        return [inputs, labels];
    }
    const subsetIndices = randomSample(rows, size);
    const inputsSubset = new Matrix2D(size, inputs.columns);
    const labelsSubset = new Matrix2D(size, labels.columns);
    for (let rowIdx = 0; rowIdx < size; rowIdx++) {
        inputsSubset.setRow(rowIdx, inputs.getRow(subsetIndices[rowIdx]));
        labelsSubset.setRow(rowIdx, labels.getRow(subsetIndices[rowIdx]));
    }
    return [inputsSubset, labelsSubset];
}
