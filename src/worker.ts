import { getSupervisedOptimizer, getUnsupervisedOptimizer } from './learning/learn';
import NeuralGeneticAlgorithm from './learning/neural_genetic';
import Topic from './observable';
import { FeedForwardNetwork } from './math/net';
import { WorkerResponse, WorkerRequest, RequestType, UnsupervisedWorkerRequest, SupervisedWorkerRequest } from './worker_interface';

const ctx: Worker = self as any;

function optimize(requestType: RequestType, optimizer: NeuralGeneticAlgorithm<any>): void {
    const topic: Topic<[FeedForwardNetwork, number]> = optimizer.topic;
    topic.subscribe(([network, generation]: [FeedForwardNetwork, number]) => {
        console.log(`Sending ${requestType} optimizer result from generation ${generation + 1}`);
        const response: WorkerResponse = {
            type: requestType,
            weights: network.weights,
            generation
        }
        ctx.postMessage(response);
    });
    optimizer.evolve();
}

function onUnsupervisedMessage(request: UnsupervisedWorkerRequest): void {
    console.log('Starting supervised computations');
    const optimizer = getUnsupervisedOptimizer();
    optimize(request.type, optimizer);
}


function onSupervisedMessage(request: SupervisedWorkerRequest): void {
    const inputs = new Float32Array(request.inputs);
    const labels = new Uint8Array(request.labels);
    console.log(`Starting supervised computations on ${labels.length} samples`);
    const optimizer = getSupervisedOptimizer(inputs, labels);
    optimize(request.type, optimizer);
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
