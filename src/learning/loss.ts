import { assertEqual } from '../utils';
import { Matrix2D, argmax2D } from '../math/multiply';

export function oneHotEncode(input: Uint8Array, nCategories: number): Matrix2D {
    const output = new Matrix2D(input.length, nCategories);
    for (let row = 0; row < input.length; row++) {
        output.buffer[row * nCategories + input[row]] = 1;
    }
    return output;
}

export function getMatchingAccuracy(predictions: Matrix2D, oneHotExpectations: Matrix2D): number {
    assertEqual(predictions.rows, oneHotExpectations.rows);
    assertEqual(predictions.columns, oneHotExpectations.columns);

    const predictedClasses = argmax2D(predictions);
    const expectedClasses = argmax2D(oneHotExpectations);

    const correctPredictions: number = predictedClasses.reduce(
        (acc, predictedClass, idx) => (acc + (predictedClass === expectedClasses[idx] ? 1 : 0)),
        0
    )
    return correctPredictions / predictions.length;
}

export function getCrossCategoricalEntropyLoss(predictions: Matrix2D, oneHotExpectations: Matrix2D): number {
    assertEqual(predictions.rows, oneHotExpectations.rows);
    assertEqual(predictions.columns, oneHotExpectations.columns);
    const rows = predictions.rows;
    const columns = predictions.columns;

    let loss = 0;
    for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
        const predictionRow: Float32Array = predictions.getRow(rowIdx);
        const expectationRow: Float32Array = oneHotExpectations.getRow(rowIdx);
        for (let columnIdx = 0; columnIdx < columns; columnIdx++) {
            loss += -expectationRow[columnIdx] * Math.log(predictionRow[columnIdx])
        }
    }
    return loss;
}
