import Topic from './observable';
import { FeedForwardNetwork } from './math/net';
import { Matrix2D } from './math/multiply';
import { createNetwork } from './learning/neural_genetic';
import { WorkerResponse, ResponseType, WorkerRequest, ProgressResponse, ReadyResponse } from './worker_interface';
import { SensorsState } from './physics/collision';
import { getStackedFeatures } from './learning/features';
import { storeNetwork } from './game/storage';

export default class WorkerCommunicator {
    private worker: Worker;
    public readonly progressTopic: Topic<[number, number]> = new Topic();
    public readonly readyTopic: Topic<[FeedForwardNetwork, number]> = new Topic();

    public constructor() {
        this.worker = new Worker('dist/worker.js');
        this.worker.addEventListener('message', this.onMessage.bind(this));
    }

    private onMessage(event: MessageEvent): void {
        const response: WorkerResponse = event.data;
        console.log(`Got ${response.type} message from worker`);
        if (response["type"] === ResponseType.PROGRESS) {
            this.onProgressMessage(response as ProgressResponse);
        } else {
            this.onReadyMessage(response as ReadyResponse);
        }
    }

    private onProgressMessage(response: ProgressResponse): void {
        this.progressTopic.next([response["step"], response["totalSteps"]]);
    }

    private onReadyMessage(response: ReadyResponse): void {
        const network: FeedForwardNetwork = createNetwork(response["weights"]);
        storeNetwork(network, response["generation"]);
        this.readyTopic.next([network, response["generation"]]);
    }

    public startLearning(inputMatrix: Matrix2D, labelsArray: Uint8Array): void {
        const inputsArray: Float32Array = inputMatrix.buffer;
        const inputs: ArrayBuffer = inputsArray.buffer;
        const labels: ArrayBuffer = labelsArray.buffer;
        const request: WorkerRequest = {
            "inputs": inputs, "labels": labels
        };
        this.worker.postMessage(request, [inputs, labels]);
    }
}
