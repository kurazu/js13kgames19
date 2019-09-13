import Vector from '../physics/vector';
import { Action, ACTIONS } from '../physics/actions';
import Ship from './ship';
import { SensorsState } from '../physics/collision';
import { FeedForwardNetwork } from '../math/net';
import { Matrix2D, argmax } from '../math/multiply';
import { LEARNING_FRAMES, FEATURES, LEARNING_EVERY_N_FRAMES } from '../constants';
import { randRange, range } from '../utils';
import { Queue } from '../math/queue';
import { getFeatures, getFeaturesQueueSize, buildInputMatrix } from '../learning/features';

const REPEATS = 10;

export default class AIShip extends Ship {
    public neuralNetwork: FeedForwardNetwork;
    private featuresQueue: Queue<Float32Array>;
    public generation: number;
    private repeats: Action[] = [];

    public constructor(neuralNetwork: FeedForwardNetwork, generation: number, randomChance: number = 0, randomDuration: number = 0) {
        super();
        this.neuralNetwork = neuralNetwork;
        this.featuresQueue = new Queue(getFeaturesQueueSize());
        this.generation = generation;
    }

    public queryControls(sensorsState: SensorsState): Action {
        this.featuresQueue.push(getFeatures(this.velocity, this.position, sensorsState));
        if (this.repeats.length) {
            return this.repeats.shift()!;
        }
        // take sensible action
        const inputMatrix: Matrix2D = buildInputMatrix(this.featuresQueue);
        const output = this.neuralNetwork.calculate(inputMatrix);
        const actionIdx = argmax(output.getRow(0));
        const action = ACTIONS[actionIdx];
        this.repeats = range(REPEATS).map(_ => action);
        return action;
    }

    public get isThinking(): boolean {
        return true;
    }

    public get name() {
        return `BACKUP-gen-${this.generation + 1}`;
    }
}
