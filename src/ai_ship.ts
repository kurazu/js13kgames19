import Vector from './vector';
import Keyboard from './keyboard';
import { Action, ACTIONS } from './actions';
import Ship from './ship';
import { SensorsState } from './collision';
import { FeedForwardNetwork } from './net';
import { Matrix2D, argmax } from './multiply';
import { SENSORS_RANGE  } from './constants';

const MAX_VALUE: number = SENSORS_RANGE + 1;

export default class AIShip extends Ship {
    private neuralNetwork: FeedForwardNetwork;

    public constructor(position: Vector, neuralNetwork: FeedForwardNetwork) {
        super(position);
        this.neuralNetwork = neuralNetwork;
    }

    public getControls(sensorsState: SensorsState): Action {
        const input = new Matrix2D(1, this.neuralNetwork.inputWidth);
        for (let idx = 0, length = this.neuralNetwork.inputWidth; idx < length; idx++) {
            const sensorState: (number | null) = sensorsState[idx];
            const sensorValue: number = sensorState === null ? MAX_VALUE : sensorState;
            const value: number = sensorValue / MAX_VALUE; // <0, 1> distribution
            input.setItem(0, idx, value);
        }
        const output = this.neuralNetwork.calculate(input);
        const maxIdx = argmax(output.getRow(0));
        return ACTIONS[maxIdx];
    }
}
