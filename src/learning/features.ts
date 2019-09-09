import { SENSORS_RANGE, MAX_VELOCITY, LEARNING_FRAMES, FEATURES, LEARNING_EVERY_N_FRAMES } from '../constants';
import { Action, ACTIONS, Actions } from '../physics/actions';
import { SensorsState } from '../physics/collision';
import Vector from '../physics/vector';
import { assert } from '../utils';
import { Matrix2D } from '../math/multiply';

const MAX_VALUE: number = SENSORS_RANGE + 1;

export function getFeatures(velocity: Vector, sensorsState: SensorsState): Float32Array {
    const result = new Float32Array(FEATURES);
    let idx = 0;
    for (const sensorState of sensorsState) {
        const sensorValue: number = sensorState === null ? MAX_VALUE : sensorState;
        const value: number = sensorValue / MAX_VALUE; // <0, 1> distribution
        result[idx++] = value;
    }
    result[idx++] = velocity.x / MAX_VELOCITY; // <0, 1> distribution
    result[idx++] = velocity.y / MAX_VELOCITY; // <0, 1> distribution
    assert(idx === FEATURES);
    return result;
}

export function getLabel(action: Action): Actions {
    const actionIdx = ACTIONS.findIndex(predefinedAction => predefinedAction.equals(action));
    if (actionIdx !== -1) {
        return actionIdx;
    } else if (action.up) {
        return Actions.UP; // pull up
    } else {
        return Actions.DRIFT; // drift
    }
}

export function getStackedFeatures(samples: [SensorsState, Vector, Action][]): [Matrix2D, Uint8Array] {
    const rows = samples.length - 1 - (LEARNING_FRAMES - 1) * LEARNING_EVERY_N_FRAMES;
    const inputs: Matrix2D = new Matrix2D(rows, LEARNING_FRAMES * FEATURES);
    const labels: Uint8Array = new Uint8Array(rows);
    for (let row = 0; row < rows; row++) {
        const [,, action]: [SensorsState, Vector, Action] = samples[samples.length - 1 - row];
        for (let frame = 0; frame < LEARNING_FRAMES; frame++) {
            const sampleIdx = samples.length - 1 - row - (LEARNING_FRAMES - 1 - frame) * LEARNING_EVERY_N_FRAMES;
            assert(sampleIdx >= 0);
            const [sensors, velocity,]: [SensorsState, Vector, Action] = samples[sampleIdx];
            const features: Float32Array = getFeatures(velocity, sensors);
            inputs.buffer.set(features, row * inputs.columns + FEATURES * frame);
        }
        const label: number = getLabel(action);
        labels[row] = label;
    }
    return [inputs, labels];
}
