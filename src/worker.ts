import getOptimizer from './learning/learn';
import Topic from './observable';
import { FeedForwardNetwork } from './math/net';

const ctx: Worker = self as any;

ctx.addEventListener('message', function(evt: MessageEvent) {
    console.log('Starting computations');
    const optimizer = getOptimizer();
    const topic: Topic<FeedForwardNetwork> = optimizer.topic;
    topic.subscribe((network: FeedForwardNetwork) => {
        console.log(`Sending optimizer result`);
        ctx.postMessage(network.weights);
    });
    optimizer.evolve();
});
