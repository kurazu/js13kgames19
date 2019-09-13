import Vector from '../physics/vector';
import { Action, ACTIONS } from '../physics/actions';
import Ship from './ship';
import { SensorsState } from '../physics/collision';
import { FeedForwardNetwork } from '../math/net';
import { Matrix2D, argmax } from '../math/multiply';
import { LEARNING_FRAMES, FEATURES, LEARNING_EVERY_N_FRAMES } from '../constants';
import { everyNthReversed, randRange } from '../utils';
import { Queue } from '../math/queue';
import { getFeatures, getFeaturesQueueSize, buildInputMatrix } from '../learning/features';

export default class AIShip extends Ship {
    public neuralNetwork: FeedForwardNetwork;
    private featuresQueue: Queue<Float32Array>;
    public generation: number;
    private randomChance: number;
    private randomDuration: number;
    private randomCounter: number = 0;
    private randomActionIdx: number = 0;

    public constructor(neuralNetwork: FeedForwardNetwork, generation: number, randomChance: number = 0, randomDuration: number = 0) {
        super();
        this.neuralNetwork = neuralNetwork;
        this.featuresQueue = new Queue(getFeaturesQueueSize());
        this.generation = generation;
        this.randomChance = randomChance;
        this.randomDuration = randomDuration;
    }

    public queryControls(sensorsState: SensorsState): Action {
        this.featuresQueue.push(getFeatures(this.velocity, this.position, sensorsState));
        let actionIdx: number;
        if (this.randomCounter) { // continue random action
            this.randomCounter--;
            actionIdx = this.randomActionIdx;
        } else if (Math.random() < this.randomChance) { // begin random action
            actionIdx = this.randomActionIdx = randRange(ACTIONS.length);
            this.randomCounter = this.randomDuration;
        } else { // take sensible action
            const inputMatrix: Matrix2D = buildInputMatrix(this.featuresQueue);
            const output = this.neuralNetwork.calculate(inputMatrix);
            actionIdx = argmax(output.getRow(0));
        }
        return ACTIONS[actionIdx];
    }

    public get isThinking(): boolean {
        return !this.randomCounter;
    }

    public get name() {
        return `BACKUP-gen-${this.generation + 1}`;
    }
}
