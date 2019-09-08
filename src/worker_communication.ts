import Topic from './observable';
import { FeedForwardNetwork } from './math/net';
import { Matrix2D } from './math/multiply';
import { createNetwork } from './genetic/game_genetic';
import { WorkerData, RequestType } from './worker_interface';
import { Action } from './physics/actions';
import { SensorState } from './physics/collision';
import { getStackedFeatures } from './learning/features';

export function learnInBackground(): Topic<[FeedForwardNetwork, number]> {
    const topic: Topic<[FeedForwardNetwork, number]> = new Topic();
    const worker = new Worker('dist/worker.js');

    worker.addEventListener('message', (event: MessageEvent) => {
        const workerData: WorkerData = event.data;
        console.log(`Received new weights from worker from generation ${workerData.generation + 1}`);
        const network = createNetwork(workerData.weights);
        topic.next([network, workerData.generation]);
    });

    // Initialize calculations.
    worker.postMessage({});

    return topic;
}


export default class WorkerCommunicator {
    private worker: Worker;

    public constructor() {
        this.worker = new Worker('dist/worker.js');
        this.worker.addEventListener('message', this.onMessage.bind(this));
    }

    private onMessage(event: MessageEvent): void {

    }

    public startUnsupervisedLearning(): void {
        this.worker.postMessage({type: RequestType.UNSUPERVISED});
    }

    public feedSupervisedLearning(inputs: Matrix2D, labels: Uint8Array): void {
        this.worker.postMessage({
            type: RequestType.SUPERVISED,
            inputs: inputs.buffer,
            labels
        }, [inputs.buffer, labels]);
    }
}
