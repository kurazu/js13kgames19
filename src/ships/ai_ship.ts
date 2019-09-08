import Vector from '../physics/vector';
import { Action, ACTIONS } from '../physics/actions';
import Ship from './ship';
import { SensorsState } from '../physics/collision';
import { FeedForwardNetwork } from '../math/net';
import { Matrix2D, argmax } from '../math/multiply';
import { LEARNING_FRAMES, FEATURES, LEARNING_EVERY_N_FRAMES } from '../constants';
import { assert, everyNthReversed } from '../utils';
import { Queue } from '../math/queue';
import { getFeatures } from '../learning/features';

export default class AIShip extends Ship {
    public neuralNetwork: FeedForwardNetwork;
    private features: Float32Array;
    private featuresQueue: Queue<Float32Array>;
    private inputMatrix: Matrix2D;

    public constructor(neuralNetwork: FeedForwardNetwork) {
        super();
        this.neuralNetwork = neuralNetwork;
        this.features = new Float32Array(FEATURES * LEARNING_FRAMES);
        this.featuresQueue = new Queue(LEARNING_FRAMES * LEARNING_EVERY_N_FRAMES);
        this.inputMatrix = new Matrix2D(1, this.neuralNetwork.inputWidth, this.features);
    }

    public getControls(sensorsState: SensorsState): Action {
        this.featuresQueue.push(getFeatures(this.velocity, sensorsState));
        this.buildInputMatrix();
        const output = this.neuralNetwork.calculate(this.inputMatrix);
        const maxIdx = argmax(output.getRow(0));
        return ACTIONS[maxIdx];
    }

    private buildInputMatrix() {
        const source = everyNthReversed(this.featuresQueue, LEARNING_EVERY_N_FRAMES);
        let idx = 0;
        for (const sourceItem of source) {
            this.features.set(sourceItem, idx++);
            if (idx >= LEARNING_FRAMES) {
                break;
            }
        }
    }
}
