import { getLabel, getStackedFeatures, getStackedFeaturesRowCount, getFeaturesQueueSize, buildInputMatrix } from '../../src/learning/features';
import { Action, Actions } from '../../src/physics/actions';
import Vector from '../../src/physics/vector';
import { SensorsState } from '../../src/physics/collision';
import { SENSORS_RANGE, MAX_VELOCITY } from '../../src/constants';
import { Queue } from '../../src/math/queue';
import { Matrix2D } from '../../src/math/multiply';
import '../matchers';

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


describe('getFeaturesQueueSize', () => {
    const testData: [number, number, number][] = [
        [1, 1, 1],
        [1, 2, 1],
        [1, 3, 1],
        [1, 4, 1],

        [2, 1, 2],
        [2, 2, 3],
        [2, 3, 4],
        [2, 4, 5],

        [3, 1, 3],
        [3, 2, 5],
        [3, 3, 7],
        [3, 4, 9],

        [4, 1, 4],
        [4, 2, 7],
        [4, 3, 10],
        [4, 4, 13]
    ];
    for (const [n, e, expectedSize] of testData) {
        test(`computes size correctly for n=${n} e=${e}`, () => {
            expect(getFeaturesQueueSize(n, e)).toEqual(expectedSize);
        });
    }
});

describe('buildInputMatrix', () => {
    const nFeatures = 3;
    const frames: Float32Array[] = [
        Float32Array.from([1,  2,  3]),
        Float32Array.from([4,  5,  6]),
        Float32Array.from([7,  8,  9]),
        Float32Array.from([10, 11, 12]),
        Float32Array.from([13, 14, 15]),
        Float32Array.from([16, 17, 18]),
        Float32Array.from([19, 20, 21]),
        Float32Array.from([22, 23, 24]),
    ];

    function getQueue(n: number, e: number): Queue<Float32Array> {
        const q: Queue<Float32Array> = new Queue(getFeaturesQueueSize(n, e));
        for (const features of frames) {
            q.push(features);
        }
        return q;
    }

    const testData: [number, number, Float32Array][] = [
        [1, 1, Float32Array.from([...frames[7]])],
        [1, 2, Float32Array.from([...frames[7]])],
        [1, 3, Float32Array.from([...frames[7]])],
        [1, 4, Float32Array.from([...frames[7]])],

        [2, 1, Float32Array.from([...frames[6], ...frames[7]])],
        [2, 2, Float32Array.from([...frames[5], ...frames[7]])],
        [2, 3, Float32Array.from([...frames[4], ...frames[7]])],
        [2, 4, Float32Array.from([...frames[3], ...frames[7]])],

        [3, 1, Float32Array.from([...frames[5], ...frames[6], ...frames[7]])],
        [3, 2, Float32Array.from([...frames[3], ...frames[5], ...frames[7]])],
        [3, 3, Float32Array.from([...frames[1], ...frames[4], ...frames[7]])],
        [3, 4, Float32Array.from([...frames[0], ...frames[3], ...frames[7]])],

        [4, 1, Float32Array.from([...frames[4], ...frames[5], ...frames[6], ...frames[7]])],
        [4, 2, Float32Array.from([...frames[1], ...frames[3], ...frames[5], ...frames[7]])],
        [4, 3, Float32Array.from([...frames[0], ...frames[1], ...frames[4], ...frames[7]])],
        [4, 4, Float32Array.from([...frames[0], ...frames[0], ...frames[3], ...frames[7]])],
    ];

    for (const [n, e, expectedArray] of testData) {
        test(`builds inputs correctly for n=${n} e=${e}`, () => {
            const queue = getQueue(n, e);
            const actualMatrix = buildInputMatrix(queue, nFeatures, n, e);
            expect(actualMatrix.columns).toEqual(n * nFeatures);
            expect(actualMatrix.rows).toEqual(1);
            expect(actualMatrix.buffer).toEqualFloat32Array(expectedArray);
        });
    }
});
