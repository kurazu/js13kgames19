import { range, zip, assert, sum } from './utils';

export class Matrix2D {
    public buffer: Float32Array;
    public rows: number;
    public columns: number;

    public constructor(rows: number, columns: number) {
        this.rows = rows;
        this.columns = columns;
        this.buffer = new Float32Array(rows * columns);
    }

    public get length() {
        return this.buffer.length;
    }

    public getAddress(row: number, column: number): number {
        assert(0 <= row && row <= this.rows);
        assert(0 <= column && column <= this.columns);
        return row * this.columns + column;
    }

    public setItem(row: number, column: number, value: number): void {
        const address = this.getAddress(row, column);
        this.buffer[address] = value;
    }

    public setRow(row: number, values: Float32Array): void {
        assert(values.length == this.columns);
        const address = this.getAddress(row, 0);
        this.buffer.set(values, address);
    }

    public set(values: number[][]): void {
        assert(values.length == this.rows);
        let address = 0;
        for (const row of values) {
            assert(row.length == this.columns);
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

    public toString(): string {
        return (
            '[\n\t' +
            range(this.rows).map(
                rowIdx => this.getRow(rowIdx)
            ).map(
                row => `[${row.join(', ')}]`
            ).join(',\n\t') +
            '\n]'
        );
    }
}

export function dot(A: Matrix2D, B: Matrix2D): Matrix2D {
    assert(A.columns == B.rows, `${A.columns} != ${B.rows}`);
    const result = new Matrix2D(A.rows, B.columns);
    for (let row = 0; row < A.rows; row++) {
        for (let column = 0; column < B.columns; column++) {
            const value = sum(zip(A.getRow(row), B.getColumn(column)).map((values: Float32Array) => values[0] * values[1]));
            result.setItem(row, column, value);
        }
    }
    return result;
}

export function addBias(matrix: Matrix2D, biasVector: Float32Array) {
    assert(matrix.columns == biasVector.length);
    const result = new Matrix2D(matrix.rows, matrix.columns);
    let address = 0;

    for (let column = 0; column < matrix.columns; column++) {
        for (const biasValue of biasVector) {
            result.buffer[address] = matrix.buffer[address] + biasValue;
            address++;
        }
    }
    return result;
}

export function relu(matrix: Matrix2D): Matrix2D {
    const result = new Matrix2D(matrix.rows, matrix.columns);
    for (let address = 0; address < result.length; address++) {
        result.buffer[address] = matrix.buffer[address] > 0 ? matrix.buffer[address] : 0;
    }
    return result;
}

function softmaxArray(array: Float32Array): Float32Array {
    const exponents = array.map(item => Math.exp(item));
    const sum = exponents.reduce((acc, item) => acc + item);
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

// const a = new Matrix2D(2, 3);
// a.set([[2, 3, 4], [5, 6, 7]]);

// const b = new Matrix2D(3, 2);
// b.set([[1, 4], [2, 5], [3, 6]]);

// const c = dot(a, b);
// console.log(c.toString());

// const d = addBias(c, [0.1, 0.2])
// console.log(d.toString());

// module.exports = {
//     Matrix2D,
//     dot,
//     addBias,
//     relu,
//     softmax
// };


export function uniformRandomDistribution(array: Float32Array, stdDeviation: number): void {
    for (let idx = 0, length = array.length; idx < length; idx++) {
        array[idx] = (Math.random() * 2 - 1) * stdDeviation;
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
