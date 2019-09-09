import { getLabel, getStackedFeatures } from '../../src/learning/features';
import { Action, Actions } from '../../src/physics/actions';
import Vector from '../../src/physics/vector';
import { SensorsState } from '../../src/physics/collision';
import { SENSORS_RANGE, MAX_VELOCITY } from '../../src/constants';

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
    test('stacks features correctly', () => {
        const [inputs, labels] = getStackedFeatures(samples, 3 + 2, 1, 2);
        expect(inputs.rows).toEqual(8);
        expect(inputs.columns).toEqual(3 + 2);
        expect(inputs.buffer).toEqual(Float32Array.from([
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
            Actions.DRIFT,
            Actions.UP,
            Actions.LEFT,
            Actions.UP_AND_LEFT,
            Actions.RIGHT,
            Actions.UP,
            Actions.DRIFT,
            Actions.UP_AND_RIGHT
        ]));
    });
});
