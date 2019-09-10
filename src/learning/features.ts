import { SENSORS_RANGE, MAX_VELOCITY, LEARNING_FRAMES, FEATURES, LEARNING_EVERY_N_FRAMES } from '../constants';
import { Action, ACTIONS, Actions } from '../physics/actions';
import { SensorsState } from '../physics/collision';
import Vector from '../physics/vector';
import { assert, assertEqual, assertDoubleRange } from '../utils';
import { Matrix2D } from '../math/multiply';
import { Queue } from '../math/queue';

const MAX_VALUE: number = SENSORS_RANGE;

export function getFeatures(velocity: Vector, sensorsState: SensorsState, nFeatures: number = FEATURES): Float32Array {
    const result = new Float32Array(nFeatures);
    let idx = 0;
    for (const sensorState of sensorsState) {
        const sensorValue: number = sensorState === null ? MAX_VALUE : sensorState;
        const value: number = sensorValue / MAX_VALUE; // <0, 1> distribution
        result[idx++] = value;
    }
    result[idx++] = velocity.x / MAX_VELOCITY; // <0, 1> distribution
    result[idx++] = velocity.y / MAX_VELOCITY; // <0, 1> distribution
    assertEqual(idx, nFeatures);
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

export function getStackedFeaturesRowCount(
    samplesCount: number, learningFrames: number, learningEveryNFrames: number
): number {
    return Math.max(0, samplesCount - (learningFrames - 1) * learningEveryNFrames);
}

export function getStackedFeatures(
    samples: [SensorsState, Vector, Action][],
    nFeatures: number = FEATURES,
    learningFrames: number = LEARNING_FRAMES,
    learningEveryNFrames: number = LEARNING_EVERY_N_FRAMES
): [Matrix2D, Uint8Array] {
    const featureSamples: [Float32Array, Actions][] = samples.map(
        ([sensors, velocity, action]: [SensorsState, Vector, Action]) => [getFeatures(velocity, sensors, nFeatures), getLabel(action)]
    );
    const rows = getStackedFeaturesRowCount(samples.length, learningFrames, learningEveryNFrames);
    const inputs: Matrix2D = new Matrix2D(rows, learningFrames * nFeatures);
    const labels: Uint8Array = new Uint8Array(rows);
    for (let row = 0; row < rows; row++) {
        for (let frame = 0; frame < learningFrames; frame++) {
            const sampleIdx = row + frame * learningEveryNFrames;
            assertDoubleRange(0, sampleIdx, samples.length);
            const [features, ]: [Float32Array, Actions] = featureSamples[sampleIdx];
            inputs.buffer.set(features, row * inputs.columns + nFeatures * frame);
        }

        const [, label]: [Float32Array, Actions] = featureSamples[row + (learningFrames - 1) * learningEveryNFrames];
        labels[row] = label;
    }
    return [inputs, labels];
}

export function getFeaturesQueueSize(
    learningFrames:number = LEARNING_FRAMES,
    learningEveryNFrames:number = LEARNING_EVERY_N_FRAMES
): number {
    return learningFrames + (learningFrames - 1) * (learningEveryNFrames - 1);
}

export function buildInputMatrix(
    queue: Queue<Float32Array>,
    nFeatures: number = FEATURES,
    learningFrames:number = LEARNING_FRAMES,
    learningEveryNFrames:number = LEARNING_EVERY_N_FRAMES
): Matrix2D {
    assertEqual(queue.maxLength, getFeaturesQueueSize(learningFrames, learningEveryNFrames));
    assert(queue.length > 0);
    while (!queue.isFull()) {
        queue.unshift(queue[0]);
    }
    const inputMatrix = new Matrix2D(1, nFeatures * learningFrames);
    let sampleIdx: number = 0;
    for (let frame = 0; frame < learningFrames; frame++) {
        const sampleIdx: number = frame * learningEveryNFrames;
        try {
            assertDoubleRange(0, sampleIdx, queue.length);
        } catch (e) {
            console.log('sampleIdx', sampleIdx, 'q', queue.length);
            throw e;
        }
        const sample: Float32Array = queue[sampleIdx];
        inputMatrix.buffer.set(sample, frame * nFeatures);
    }
    return inputMatrix;
}
