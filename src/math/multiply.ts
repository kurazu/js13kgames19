import { range, zip, sum, uniformRandom } from '../utils';

export class Matrix2D {
    public readonly buffer: Float32Array;
    public readonly rows: number;
    public readonly columns: number;

    public constructor(rows: number, columns: number, buffer: (Float32Array | null) = null) {
        const bufferLength = rows * columns;
        this.rows = rows;
        this.columns = columns;
        if (buffer) {
            this.buffer = buffer;
        } else {
            this.buffer = new Float32Array(bufferLength);
        }
    }

    public getAddress(row: number, column: number): number {
        return row * this.columns + column;
    }

    public setItem(row: number, column: number, value: number): void {
        const address = this.getAddress(row, column);
        this.buffer[address] = value;
    }

    public setRow(row: number, values: Float32Array): void {
        const address = this.getAddress(row, 0);
        this.buffer.set(values, address);
    }

    public set(values: number[][]): void {
        let address = 0;
        for (const row of values) {
            for (const value of row) {
                this.buffer[address++] = value;
            }
        }
    }

    public getItem(row: number, column: number): number {
        const address = this.getAddress(row, column);
        return this.buffer[address];
    }

    public getRow(row: number): Float32Array {
        const address = this.getAddress(row, 0);
        return this.buffer.slice(address, address + this.columns);
    }

    public getColumn(column: number): Float32Array {
        return Float32Array.from(
            range(this.rows).map(row => this.buffer[row * this.columns + column])
        );
    }
}

export function dot(A: Matrix2D, B: Matrix2D): Matrix2D {
    const result = new Matrix2D(A.rows, B.columns);
    for (let row = 0; row < A.rows; row++) {
        for (let column = 0; column < B.columns; column++) {
            let value: number = 0;
            for (let idx = 0; idx < A.columns; idx++) {
                value += A.buffer[row * A.columns + idx] * B.buffer[idx * B.columns + column];
            }
            result.buffer[row * result.columns + column] = value;
        }
    }
    return result;
}

export function addBias(matrix: Matrix2D, biasVector: Float32Array) {
    return new Matrix2D(matrix.rows, matrix.columns, matrix.buffer.map(
        (item, idx) => item + biasVector[idx % matrix.columns]
    ));
}

export function relu(matrix: Matrix2D): Matrix2D {
    return new Matrix2D(matrix.rows, matrix.columns, matrix.buffer.map(x => x >= 0 ? x : 0));
}

export function sigmoid(matrix: Matrix2D): Matrix2D {
    return new Matrix2D(matrix.rows, matrix.columns, matrix.buffer.map(x => 1 / (1 + Math.exp(-x))));
}

function softmaxArray(array: Float32Array): Float32Array {
    const exponents = array.map(item => Math.exp(item));
    const sum = exponents.reduce((acc, item) => acc + item, 0);
    return exponents.map(exponent => exponent / sum);
}

export function softmax(matrix: Matrix2D): Matrix2D {
    const result = new Matrix2D(matrix.rows, matrix.columns);
    range(matrix.rows).forEach(rowIdx => {
        const row = matrix.getRow(rowIdx);
        const value = softmaxArray(row);
        result.setRow(rowIdx, value);
    })
    return result;
}


export function uniformRandomDistribution(array: Float32Array): void {
    for (let idx = 0, length = array.length; idx < length; idx++) {
        array[idx] = uniformRandom();
    }
}


export function argmax(array: Float32Array): number {
    let bestIdx: (number | undefined), bestValue: (number | undefined);
    for (const [idx, item] of array.entries()) {
        if (bestIdx === undefined || item > bestValue!) {
            bestIdx = idx;
            bestValue = item;
        }
    }
    return bestIdx!;
}


export function argmax2D(input: Matrix2D): Uint8Array {
    const output = new Uint8Array(input.rows);
    for (let idx = 0; idx < input.rows; idx++) {
        output[idx] = argmax(input.getRow(idx));
    }
    return output;
}

export function multiply(a: Matrix2D, b: Matrix2D): Matrix2D {
    return new Matrix2D(
        a.rows, a.columns,
        a.buffer.map((aValue, idx) => aValue * b.buffer[idx])
    );
}

export function addScalar(input: Matrix2D, scalar: number): Matrix2D {
    return new Matrix2D(input.rows, input.columns, input.buffer.map(x => x * scalar));
}

export function multiplyByScalar(input: Matrix2D, factor: number): Matrix2D {
    return new Matrix2D(input.rows, input.columns, input.buffer.map(x => x * factor));
}

export function relu_derivate(input: Matrix2D): Matrix2D {
    return new Matrix2D(input.rows, input.columns, input.buffer.map(x => Number(x > 0)));
}

export function sigmoid_derivate(input: Matrix2D): Matrix2D {
    return multiply(input, addScalar(multiplyByScalar(input, -1), 1));
}

export function softmax_derivate(input: Matrix2D): Matrix2D {
    const result = new Matrix2D(input.rows, input.columns);
    for (let rowIdx = 0; rowIdx < input.rows; rowIdx++) {
        throw new Error("Not implemented");
    }
    return result;
}

export function add(matrices: Matrix2D[]): Matrix2D {
    const first = matrices[0];
    const result = new Matrix2D(first.rows, first.columns);
    for (let address = 0; address < result.buffer.length; address++) {
        for (const matrix of matrices) {
            result.buffer[address] += matrix.buffer[address];
        }
    }
    return result;
}
