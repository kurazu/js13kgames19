function assert(condition, msg='') {
    if (!condition) {
        throw new Error(msg)
    }
}

function zip(...sequences) {
    const first = sequences[0];
    for (const sequence of sequences) {
        assert(sequence.length === first.length);
    }
    return first.map((_, idx) => sequences.map(sequence => sequence[idx]));
}

function range(n) {
    const result = [];
    for (let i = 0; i < n; i++) {
        result.push(i);
    }
    return result;
}

function sum(sequence) {
    let result = 0;
    for (const item of sequence) {
        result += item;
    }
    return result;
}

class Matrix2D {
    constructor(rows, columns) {
        const length = rows * columns;
        this.buffer = new Float32Array(length);
        this.rows = rows;
        this.columns = columns;
    }

    getAddress(row, column) {
        assert(0 <= row && row <= this.rows);
        assert(0 <= column && column <= this.columns);
        return row * this.columns + column;
    }

    setItem(row, column, value) {
        const address = this.getAddress(row, column);
        this.buffer[address] = value;
    }

    setRow(row, values) {
        assert(values.length == this.rows);
        const address = this.getAddress(row, 0);
        for (const [offset, value] of values.entries()) {
            this.buffer[address + offset] = value;
        }
    }

    set(values) {
        assert(values.length == this.rows);
        let address = 0;
        for (const row of values) {
            assert(row.length == this.columns);
            for (const value of row) {
                this.buffer[address++] = value;
            }
        }
    }

    getItem(row, column) {
        const address = this.getAddress(row, column);
        return this.buffer[address];
    }

    getRow(row) {
        const address = this.getAddress(row, 0);
        return range(this.columns).map(offset => this.buffer[address + offset]);
    }

    getColumn(column) {
        return range(this.rows).map(row => this.buffer[row * this.columns + column]);
    }

    toString() {
        return '[\n\t' + range(this.rows).map(rowIdx => this.getRow(rowIdx)).map(row => `[${row.join(', ')}]`).join(',\n\t') + '\n]';
    }
}

function dot(A, B) {
    assert(A.columns == B.rows);
    const result = new Matrix2D(A.rows, B.columns);
    for (let row = 0; row < A.rows; row++) {
        for (let column = 0; column < B.columns; column++) {
            const value = sum(zip(A.getRow(row), B.getColumn(column)).map(([aValue, bValue]) => aValue * bValue));
            result.setItem(row, column, value);
        }
    }
    return result;
}

function addBias(matrix, biasVector) {
    assert(matrix.rows == biasVector.length);
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

const a = new Matrix2D(2, 3);
a.set([[2, 3, 4], [5, 6, 7]]);

const b = new Matrix2D(3, 2);
b.set([[1, 4], [2, 5], [3, 6]]);

const c = dot(a, b);
console.log(c.toString());

const d = addBias(c, [0.1, 0.2])
console.log(d.toString());
