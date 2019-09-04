import Vector from './vector';
import Keyboard from './keyboard';
import { Action, ACTIONS } from './actions';
import Ship from './ship';
import { SensorsState } from './collision';
import { FeedForwardNetwork } from './net';
import { Matrix2D, argmax } from './multiply';
import { SENSORS_RANGE, MAX_VELOCITY, LEARNING_FRAMES, FEATURES } from './constants';
import { assert } from './utils';
import FeaturesQueue from './queue';

const MAX_VALUE: number = SENSORS_RANGE + 1;

export default class AIShip extends Ship {
    public readonly neuralNetwork: FeedForwardNetwork;
    private features: FeaturesQueue;

    public constructor(position: Vector, neuralNetwork: FeedForwardNetwork) {
        super(position);
        this.neuralNetwork = neuralNetwork;
        this.features = new FeaturesQueue(FEATURES, LEARNING_FRAMES);
    }

    public getFeatures(sensorsState: SensorsState): Float32Array {
        const result = new Float32Array(FEATURES);
        let idx = 0;
        for (const sensorState of sensorsState) {
            const sensorValue: number = sensorState === null ? MAX_VALUE : sensorState;
            const value: number = sensorValue / MAX_VALUE; // <0, 1> distribution
            result[idx++] = value;
        }
        result[idx++] = this.velocity.x / MAX_VELOCITY; // <0, 1> distribution
        result[idx++] = this.velocity.y / MAX_VELOCITY; // <0, 1> distribution
        assert(idx === FEATURES);
        return result;
    }

    public getControls(sensorsState: SensorsState): Action {
        this.features.push(this.getFeatures(sensorsState))
        const input = new Matrix2D(1, this.neuralNetwork.inputWidth, this.features.array);
        const output = this.neuralNetwork.calculate(input);
        const maxIdx = argmax(output.getRow(0));
        return ACTIONS[maxIdx];
    }
}
