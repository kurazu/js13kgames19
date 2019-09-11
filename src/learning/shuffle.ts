import { range } from '../utils';

export function shuffle(a: number[]): void {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const x = a[j];
        a[j] = a[i];
        a[i] = x;
    }
}


export function shuffleArrays(inputs: Float32Array, labels: Float32Array, rows: number): [Float32Array, Float32Array] {
    const indices = range(rows);
    const inputsColumns = inputs.length / rows;
    const labelsColumns = labels.length / rows;
    shuffle(indices);
    const inputsResult = new Float32Array(inputs.length);
    const labelsResult = new Float32Array(labels.length);
    for (const [originalIdx, targetIdx] of indices.entries()) {
        inputsResult.set(inputs.subarray(targetIdx * inputsColumns, targetIdx * inputsColumns + inputsColumns), originalIdx * inputsColumns);
        labelsResult.set(labels.subarray(targetIdx * labelsColumns, targetIdx * labelsColumns + labelsColumns), originalIdx * labelsColumns);
    }
    return [inputsResult, labelsResult];
}
