import Vector from '../physics/vector';
import { Action, ACTIONS } from '../physics/actions';
import Ship from './ship';
import { SensorsState } from '../physics/collision';
import { FeedForwardNetwork } from '../math/net';
import { Matrix2D, argmax } from '../math/multiply';
import { LEARNING_FRAMES, FEATURES, LEARNING_EVERY_N_FRAMES } from '../constants';
import { assert, everyNthReversed, randRange } from '../utils';
import { Queue } from '../math/queue';
import { getFeatures } from '../learning/features';

function getNeededQueueSize(): number {
    if (LEARNING_FRAMES === 1) {
        return 1;
    } else if (LEARNING_EVERY_N_FRAMES === 1) {
        return LEARNING_FRAMES;
    } else {
        return LEARNING_FRAMES * (LEARNING_EVERY_N_FRAMES - 1);
    }
}

export default class AIShip extends Ship {
    public neuralNetwork: FeedForwardNetwork;
    private features: Float32Array;
    private featuresQueue: Queue<Float32Array>;
    private inputMatrix: Matrix2D;
    public generation: number;
    private randomChance: number;
    private randomDuration: number;
    private randomCounter: number = 0;
    private randomActionIdx: number = 0;

    public constructor(neuralNetwork: FeedForwardNetwork, generation: number, randomChance: number = 0, randomDuration: number = 0) {
        super();
        this.neuralNetwork = neuralNetwork;
        this.features = new Float32Array(FEATURES * LEARNING_FRAMES);
        this.featuresQueue = new Queue(getNeededQueueSize());
        this.inputMatrix = new Matrix2D(1, this.neuralNetwork.inputWidth, this.features);
        this.generation = generation;
        this.randomChance = randomChance;
        this.randomDuration = randomDuration;
    }

    public queryControls(sensorsState: SensorsState): Action {
        this.featuresQueue.push(getFeatures(this.velocity, sensorsState));
        let actionIdx: number;
        if (this.randomCounter) { // continue random action
            this.randomCounter--;
            actionIdx = this.randomActionIdx;
        } else if (Math.random() < this.randomChance) { // begin random action
            actionIdx = this.randomActionIdx = randRange(ACTIONS.length);
            this.randomCounter = this.randomDuration;
        } else { // take sensible action
            const output = this.neuralNetwork.calculate(this.inputMatrix);
            actionIdx = argmax(output.getRow(0));
            this.buildInputMatrix();
        }
        return ACTIONS[actionIdx];
    }

    public get isThinking(): boolean {
        return !this.randomCounter;
    }

    private buildInputMatrix() {
        let sampleIdx: number = 0;
        for (let frame = 0; frame < LEARNING_FRAMES; frame++) {
            sampleIdx = frame * LEARNING_EVERY_N_FRAMES;
            assert(0 <= sampleIdx && sampleIdx < this.featuresQueue.length);
            const sample: Float32Array = this.featuresQueue[sampleIdx];
            this.features.set(sample, frame * FEATURES);
        }
        assert(sampleIdx === this.featuresQueue.length - 1);
    }

    public get name() {
        return `BOT-gen-${this.generation}`;
    }
}
