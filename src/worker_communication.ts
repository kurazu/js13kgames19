import Topic from './observable';
import { FeedForwardNetwork } from './math/net';
import { Matrix2D } from './math/multiply';
import { createNetwork } from './learning/neural_genetic';
import { WorkerResponse, SupervisedWorkerRequest, UnsupervisedWorkerRequest, RequestType } from './worker_interface';
import { SensorsState } from './physics/collision';
import { getStackedFeatures } from './learning/features';

export default class WorkerCommunicator {
    private worker: Worker;
    public readonly supervisedTopic: Topic<[FeedForwardNetwork, number]>;
    public readonly unsupervisedTopic: Topic<[FeedForwardNetwork, number]>;

    public constructor() {
        this.supervisedTopic = new Topic();
        this.unsupervisedTopic = new Topic();

        this.worker = new Worker('dist/worker.js');
        this.worker.addEventListener('message', this.onMessage.bind(this));
    }

    private onMessage(event: MessageEvent): void {
        const response: WorkerResponse = event.data;
        console.log(`Got ${response.type} message from worker`);
        const topic: Topic<[FeedForwardNetwork, number]> = (
            response.type === RequestType.SUPERVISED ? this.supervisedTopic : this.unsupervisedTopic
        );
        const network: FeedForwardNetwork = createNetwork(response.weights);
        topic.next([network, response.generation]);
    }

    public startUnsupervisedLearning(): void {
        const request: UnsupervisedWorkerRequest = {type: RequestType.UNSUPERVISED};
        this.worker.postMessage(request);
    }

    public startSupervisedLearning(inputMatrix: Matrix2D, labelsArray: Uint8Array): void {
        const inputsArray: Float32Array = inputMatrix.buffer;
        const inputs: ArrayBuffer = inputsArray.buffer;
        const labels: ArrayBuffer = labelsArray.buffer;
        const request: SupervisedWorkerRequest = {
            type: RequestType.SUPERVISED,
            inputs,
            labels
        };
        this.worker.postMessage(request, [inputs, labels]);
    }
}
