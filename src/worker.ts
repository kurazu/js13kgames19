import getOptimizer from './learning/learn';
import Topic from './observable';
import { FeedForwardNetwork } from './math/net';
import { WorkerRequest, RequestType, UnsupervisedWorkerRequest, SupervisedWorkerRequest } from './worker_interface';

const ctx: Worker = self as any;

function onUnsupervisedMessage(request: UnsupervisedWorkerRequest): void {
    console.log('Starting computations');
    const optimizer = getOptimizer();
    const topic: Topic<[FeedForwardNetwork, number]> = optimizer.topic;
    topic.subscribe(([network, generation]: [FeedForwardNetwork, number]) => {
        console.log(`Sending optimizer result from generation ${generation + 1}`);
        const workerData: WorkerData = {
            weights: network.weights,
            generation
        }
        ctx.postMessage(workerData);
    });
    optimizer.evolve();
}


function onSupervisedMessage(request: SupervisedWorkerRequest): void {

}

ctx.addEventListener('message', function(evt: MessageEvent) {
    const request: WorkerRequest = evt.data;
    const { type } = request;
    if (type === RequestType.SUPERVISED) {
        onSupervisedMessage(request as SupervisedWorkerRequest);
    } else if (type === RequestType.UNSUPERVISED) {
        onUnsupervisedMessage(request as UnsupervisedWorkerRequest);
    } else {
        console.error('Unhandled message', request);
    }
});
