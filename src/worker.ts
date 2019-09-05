import getOptimizer from './learning/learn';
import Topic from './observable';
import { FeedForwardNetwork } from './math/net';
import WorkerData from './worker_interface';

const ctx: Worker = self as any;

ctx.addEventListener('message', function(evt: MessageEvent) {
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
});
