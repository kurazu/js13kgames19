import { getLabel, getStackedFeatures, getStackedFeaturesRowCount } from '../../src/learning/features';
import { Action, Actions } from '../../src/physics/actions';
import Vector from '../../src/physics/vector';
import { SensorsState } from '../../src/physics/collision';
import { SENSORS_RANGE, MAX_VELOCITY } from '../../src/constants';

interface MatcherResult {
    message: () => string,
    pass: boolean
}

expect.extend({
    toEqualFloat32Array(received: any, expected: Float32Array): MatcherResult {
        if (!(received instanceof Float32Array)) {
            return {
                message: () => `expected Float32Array, but got ${received.constructor}`,
                pass: false
            };
        } else if (received.length !== expected.length) {
            return {
                message: () => `expected length ${expected.length}, but got ${received.length}`,
                pass: false
            }
        }
        for (const [idx, actual] of received.entries()) {
            const exp = expected[idx];
            if (Math.abs(exp - actual) > 1e-10) {
                return {
                    message: () => `expected element at ${idx} to be close to ${exp} but got ${actual}`,
                    pass: false
                }
            }
        }

        return {pass: true, message: () => ''};
    }
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toEqualFloat32Array(expected: Float32Array): R;
    }
  }
}

describe('getLabel', () => {
    const testData: [boolean, boolean, boolean, Actions][] = [
        [false, false, false, Actions.DRIFT],
        [true, false, false, Actions.UP],
        [false, true, false, Actions.LEFT],
        [false, false, true, Actions.RIGHT],
        [true, true, false, Actions.UP_AND_LEFT],
        [true, false, true, Actions.UP_AND_RIGHT],
        [false, true, true, Actions.DRIFT],
        [true, true, true, Actions.UP],
    ];
    for (const [up, left, right, expectedLabel] of testData) {
        test(`gets the correct label for up=${up}, left=${left}, right=${right}`, () => {
            expect(getLabel(new Action(up, left, right))).toStrictEqual(expectedLabel);
        });
    }
});


describe('getStackedFeatures', () => {
    const samples: [SensorsState, Vector, Action][] = [
        [[1,  2,    3   ], new Vector(0.1, 0.15), new Action(false, false, false)],
        [[4,  5,    6   ], new Vector(0.2, 0.25), new Action(true, false, false)],
        [[7,  8,    9   ], new Vector(0.3, 0.35), new Action(false, true, false)],
        [[10, 11,   12  ], new Vector(0.4, 0.45), new Action(true, true, false)],
        [[13, 14,   null], new Vector(0.5, 0.55), new Action(false, false, true)],
        [[1,  null, 3   ], new Vector(0.6, 0.65), new Action(true, true, true)],
        [[4,  null, 6   ], new Vector(0.7, 0.75), new Action(false, true, true)],
        [[7,  null, 9   ], new Vector(0.8, 0.85), new Action(true, false, true)],
    ];
    const expectedFeatures: number[][] = [
        [1 / SENSORS_RANGE,  2 / SENSORS_RANGE,             3 / SENSORS_RANGE,             0.1 / MAX_VELOCITY, 0.15 / MAX_VELOCITY],
        [4 / SENSORS_RANGE,  5 / SENSORS_RANGE,             6 / SENSORS_RANGE,             0.2 / MAX_VELOCITY, 0.25 / MAX_VELOCITY],
        [7 / SENSORS_RANGE,  8 / SENSORS_RANGE,             9 / SENSORS_RANGE,             0.3 / MAX_VELOCITY, 0.35 / MAX_VELOCITY],
        [10 / SENSORS_RANGE, 11 / SENSORS_RANGE,            12 / SENSORS_RANGE,            0.4 / MAX_VELOCITY, 0.45 / MAX_VELOCITY],
        [13 / SENSORS_RANGE, 14 / SENSORS_RANGE,            SENSORS_RANGE / SENSORS_RANGE, 0.5 / MAX_VELOCITY, 0.55 / MAX_VELOCITY],
        [1 / SENSORS_RANGE,  SENSORS_RANGE / SENSORS_RANGE, 3 / SENSORS_RANGE,             0.6 / MAX_VELOCITY, 0.65 / MAX_VELOCITY],
        [4 / SENSORS_RANGE,  SENSORS_RANGE / SENSORS_RANGE, 6 / SENSORS_RANGE,             0.7 / MAX_VELOCITY, 0.75 / MAX_VELOCITY],
        [7 / SENSORS_RANGE,  SENSORS_RANGE / SENSORS_RANGE, 9 / SENSORS_RANGE,             0.8 / MAX_VELOCITY, 0.85 / MAX_VELOCITY],
    ];
    const expectedActions: Actions[] = [
        Actions.DRIFT,
        Actions.UP,
        Actions.LEFT,
        Actions.UP_AND_LEFT,
        Actions.RIGHT,
        Actions.UP,
        Actions.DRIFT,
        Actions.UP_AND_RIGHT
    ];
    const nFeatures = 3 + 2;

    for (const e of [1, 2, 3, 4, 5]) {
        test(`stacks features correctly for n=1 e=${e}`, () => {
            const [inputs, labels] = getStackedFeatures(samples, nFeatures, 1, e);
            expect(inputs.columns).toEqual(nFeatures);
            expect(inputs.rows).toEqual(8);
            expect(inputs.buffer).toEqualFloat32Array(Float32Array.from([
                ...expectedFeatures[0],
                ...expectedFeatures[1],
                ...expectedFeatures[2],
                ...expectedFeatures[3],
                ...expectedFeatures[4],
                ...expectedFeatures[5],
                ...expectedFeatures[6],
                ...expectedFeatures[7]

            ]));
            expect(labels).toEqual(Uint8Array.from([
                expectedActions[0],
                expectedActions[1],
                expectedActions[2],
                expectedActions[3],
                expectedActions[4],
                expectedActions[5],
                expectedActions[6],
                expectedActions[7]
            ]));
        });
    }

    test('stacks features correctly for n=2 e=2', () => {
        const [inputs, labels] = getStackedFeatures(samples, nFeatures, 2, 2);
        expect(inputs.columns).toEqual(nFeatures * 2);
        expect(inputs.rows).toEqual(6);
        expect(inputs.buffer).toEqualFloat32Array(Float32Array.from([
            ...expectedFeatures[0], ...expectedFeatures[2],
            ...expectedFeatures[1], ...expectedFeatures[3],
            ...expectedFeatures[2], ...expectedFeatures[4],
            ...expectedFeatures[3], ...expectedFeatures[5],
            ...expectedFeatures[4], ...expectedFeatures[6],
            ...expectedFeatures[5], ...expectedFeatures[7]
        ]));
        expect(labels).toEqual(Uint8Array.from([
            expectedActions[2],
            expectedActions[3],
            expectedActions[4],
            expectedActions[5],
            expectedActions[6],
            expectedActions[7]
        ]));
    });

    test('stacks features correctly for n=3 e=2', () => {
        const [inputs, labels] = getStackedFeatures(samples, nFeatures, 3, 2);
        expect(inputs.columns).toEqual(nFeatures * 3);
        expect(inputs.rows).toEqual(4);
        expect(inputs.buffer).toEqualFloat32Array(Float32Array.from([
            ...expectedFeatures[0], ...expectedFeatures[2], ...expectedFeatures[4],
            ...expectedFeatures[1], ...expectedFeatures[3], ...expectedFeatures[5],
            ...expectedFeatures[2], ...expectedFeatures[4], ...expectedFeatures[6],
            ...expectedFeatures[3], ...expectedFeatures[5], ...expectedFeatures[7],
        ]));
        expect(labels).toEqual(Uint8Array.from([
            expectedActions[4],
            expectedActions[5],
            expectedActions[6],
            expectedActions[7]
        ]));
    });

    test('stacks features correctly for n=4 e=2', () => {
        const [inputs, labels] = getStackedFeatures(samples, nFeatures, 4, 2);
        expect(inputs.columns).toEqual(nFeatures * 4);
        expect(inputs.rows).toEqual(2);
        expect(inputs.buffer).toEqualFloat32Array(Float32Array.from([
            ...expectedFeatures[0], ...expectedFeatures[2], ...expectedFeatures[4], ...expectedFeatures[6],
            ...expectedFeatures[1], ...expectedFeatures[3], ...expectedFeatures[5], ...expectedFeatures[7],
        ]));
        expect(labels).toEqual(Uint8Array.from([
            expectedActions[6],
            expectedActions[7]
        ]));
    });

    test('stacks features correctly for n=4 e=3', () => {
        const [inputs, labels] = getStackedFeatures(samples, nFeatures, 4, 3);
        expect(inputs.columns).toEqual(nFeatures * 4);
        expect(inputs.rows).toEqual(0);
        expect(inputs.buffer).toEqualFloat32Array(Float32Array.from([]));
        expect(labels).toEqual(Uint8Array.from([]));
    });

    test('stacks features correctly for n=2, e=3', () => {
        const [inputs, labels] = getStackedFeatures(samples, nFeatures, 2, 3);
        expect(inputs.columns).toEqual(nFeatures * 2);
        expect(inputs.rows).toEqual(5);
        expect(inputs.buffer).toEqualFloat32Array(Float32Array.from([
            ...expectedFeatures[0], ...expectedFeatures[3],
            ...expectedFeatures[1], ...expectedFeatures[4],
            ...expectedFeatures[2], ...expectedFeatures[5],
            ...expectedFeatures[3], ...expectedFeatures[6],
            ...expectedFeatures[4], ...expectedFeatures[7],
        ]));
        expect(labels).toEqual(Uint8Array.from([
            expectedActions[3],
            expectedActions[4],
            expectedActions[5],
            expectedActions[6],
            expectedActions[7]
        ]));
    });

    test('stacks features correctly for n=2, e=4', () => {
        const [inputs, labels] = getStackedFeatures(samples, nFeatures, 2, 4);
        expect(inputs.columns).toEqual(nFeatures * 2);
        expect(inputs.rows).toEqual(4);
        expect(inputs.buffer).toEqualFloat32Array(Float32Array.from([
            ...expectedFeatures[0], ...expectedFeatures[4],
            ...expectedFeatures[1], ...expectedFeatures[5],
            ...expectedFeatures[2], ...expectedFeatures[6],
            ...expectedFeatures[3], ...expectedFeatures[7],
        ]));
        expect(labels).toEqual(Uint8Array.from([
            expectedActions[4],
            expectedActions[5],
            expectedActions[6],
            expectedActions[7]
        ]));
    });

    test('stacks features correctly for n=3, e=3', () => {
        const [inputs, labels] = getStackedFeatures(samples, nFeatures, 3, 3);
        expect(inputs.columns).toEqual(nFeatures * 3);
        expect(inputs.rows).toEqual(2);
        expect(inputs.buffer).toEqualFloat32Array(Float32Array.from([
            ...expectedFeatures[0], ...expectedFeatures[3], ...expectedFeatures[6],
            ...expectedFeatures[1], ...expectedFeatures[4], ...expectedFeatures[7],
        ]));
        expect(labels).toEqual(Uint8Array.from([
            expectedActions[6],
            expectedActions[7]
        ]));
    });

    test('stacks features correctly for n=2, e=1', () => {
        const [inputs, labels] = getStackedFeatures(samples, nFeatures, 2, 1);
        expect(inputs.columns).toEqual(nFeatures * 2);
        expect(inputs.rows).toEqual(7);
        expect(inputs.buffer).toEqualFloat32Array(Float32Array.from([
            ...expectedFeatures[0], ...expectedFeatures[1],
            ...expectedFeatures[1], ...expectedFeatures[2],
            ...expectedFeatures[2], ...expectedFeatures[3],
            ...expectedFeatures[3], ...expectedFeatures[4],
            ...expectedFeatures[4], ...expectedFeatures[5],
            ...expectedFeatures[5], ...expectedFeatures[6],
            ...expectedFeatures[6], ...expectedFeatures[7],
        ]));
        expect(labels).toEqual(Uint8Array.from([
            expectedActions[1],
            expectedActions[2],
            expectedActions[3],
            expectedActions[4],
            expectedActions[5],
            expectedActions[6],
            expectedActions[7]
        ]));
    });

    test('stacks features correctly for n=3, e=1', () => {
        const [inputs, labels] = getStackedFeatures(samples, nFeatures, 3, 1);
        expect(inputs.columns).toEqual(nFeatures * 3);
        expect(inputs.rows).toEqual(6);
        expect(inputs.buffer).toEqualFloat32Array(Float32Array.from([
            ...expectedFeatures[0], ...expectedFeatures[1], ...expectedFeatures[2],
            ...expectedFeatures[1], ...expectedFeatures[2], ...expectedFeatures[3],
            ...expectedFeatures[2], ...expectedFeatures[3], ...expectedFeatures[4],
            ...expectedFeatures[3], ...expectedFeatures[4], ...expectedFeatures[5],
            ...expectedFeatures[4], ...expectedFeatures[5], ...expectedFeatures[6],
            ...expectedFeatures[5], ...expectedFeatures[6], ...expectedFeatures[7]
        ]));
        expect(labels).toEqual(Uint8Array.from([
            expectedActions[2],
            expectedActions[3],
            expectedActions[4],
            expectedActions[5],
            expectedActions[6],
            expectedActions[7]
        ]));
    });

    test('stacks features correctly for n=4, e=1', () => {
        const [inputs, labels] = getStackedFeatures(samples, nFeatures, 4, 1);
        expect(inputs.columns).toEqual(nFeatures * 4);
        expect(inputs.rows).toEqual(5);
        expect(inputs.buffer).toEqualFloat32Array(Float32Array.from([
            ...expectedFeatures[0], ...expectedFeatures[1], ...expectedFeatures[2], ...expectedFeatures[3],
            ...expectedFeatures[1], ...expectedFeatures[2], ...expectedFeatures[3], ...expectedFeatures[4],
            ...expectedFeatures[2], ...expectedFeatures[3], ...expectedFeatures[4], ...expectedFeatures[5],
            ...expectedFeatures[3], ...expectedFeatures[4], ...expectedFeatures[5], ...expectedFeatures[6],
            ...expectedFeatures[4], ...expectedFeatures[5], ...expectedFeatures[6], ...expectedFeatures[7]
        ]));
        expect(labels).toEqual(Uint8Array.from([
            expectedActions[3],
            expectedActions[4],
            expectedActions[5],
            expectedActions[6],
            expectedActions[7]
        ]));
    });
});


describe('getStackedFeaturesRowCount', () => {
    const expectation: [number, number, number][] = [
        [4, 1, 5],
        [3, 1, 6],
        [2, 1, 7],
        [1, 1, 8],
        [4, 2, 2],
        [3, 2, 4],
        [2, 2, 6],
        [1, 2, 8],
        [4, 3, 0],
        [3, 3, 2],
        [2, 3, 5],
        [1, 3, 8],
        [4, 4, 0],
        [3, 4, 0],
        [2, 4, 4],
        [1, 4, 8]
    ];
    for (const [n, e, rows] of expectation) {
        test(`computes number of rows correctly for n=${n} e=${e}`, () => {
            expect(getStackedFeaturesRowCount(8, n, e)).toEqual(rows);
        });
    }
})
