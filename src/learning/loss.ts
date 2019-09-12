import { Matrix2D, argmax2D } from '../math/multiply';

export function oneHotEncode(input: Uint8Array, nCategories: number): Matrix2D {
    const output = new Matrix2D(input.length, nCategories);
    for (let row = 0; row < input.length; row++) {
        output.buffer[row * nCategories + input[row]] = 1;
    }
    return output;
}

export function getMatchingAccuracy(predictions: Matrix2D, oneHotExpectations: Matrix2D): number {
    const predictedClasses = argmax2D(predictions);
    const expectedClasses = argmax2D(oneHotExpectations);

    const correctPredictions: number = predictedClasses.reduce(
        (acc, predictedClass, idx) => (acc + (predictedClass === expectedClasses[idx] ? 1 : 0)),
        0
    )
    return correctPredictions / predictions.rows;
}

export function getCrossCategoricalEntropyLoss(predictions: Matrix2D, oneHotExpectations: Matrix2D): number {
    const rows = predictions.rows;
    const columns = predictions.columns;

    let loss = 0;
    for (let address = 0; address < predictions.buffer.length; address++) {
        loss += -oneHotExpectations.buffer[address] * Math.log(predictions.buffer[address]);
    }
    return loss;
}
