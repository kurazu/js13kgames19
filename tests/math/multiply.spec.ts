import { Matrix2D, addBias } from '../../src/math/multiply';
import '../matchers';

declare global {
  namespace jest {
    interface Matchers<R> {
      toEqualFloat32Array(expected: Float32Array): R;
    }
  }
}

describe('addBias', () => {
    test('correctly adds bias vector to a 3x4 matrix', () => {
        const input = new Matrix2D(3, 4, Float32Array.from([
            1, 2,  3,  4,
            5, 6,  7,  8,
            9, 10, 11, 12
        ]));
        const bias = Float32Array.from([0.1, 0.2, 0.3, 0.4]);
        const output = addBias(input, bias);
        expect(output.rows).toEqual(input.rows);
        expect(output.columns).toEqual(output.columns);
        expect(output.buffer).toEqualFloat32Array(Float32Array.from([
            1.1, 2.2,  3.3,  4.4,
            5.1, 6.2,  7.3,  8.4,
            9.1, 10.2, 11.3, 12.4
        ]));
    });

    test('correctly adds bias vector to a 4x3 matrix', () => {
        const input = new Matrix2D(4, 3, Float32Array.from([
            1,  2,  3,
            4,  5,  6,
            7,  8,  9,
            10, 11, 12
        ]));
        const bias = Float32Array.from([0.1, 0.2, 0.3]);
        const output = addBias(input, bias);
        expect(output.rows).toEqual(input.rows);
        expect(output.columns).toEqual(output.columns);
        expect(output.buffer).toEqualFloat32Array(Float32Array.from([
            1.1,  2.2,  3.3,
            4.1,  5.2,  6.3,
            7.1,  8.2,  9.3,
            10.1, 11.2, 12.3
        ]));
    });
})
