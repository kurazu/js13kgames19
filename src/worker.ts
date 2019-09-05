import learn from './learning/learn';
import { FeedForwardNetwork } from './math/net';

const ctx: Worker = self as any;

ctx.addEventListener('message', function(evt: MessageEvent) {
    console.log('Starting computations');
    learn((network: FeedForwardNetwork, generation: number, maxGenerations: number) => {
        console.log(`Sending generation ${generation}/${maxGenerations} result`);
        ctx.postMessage({
            generation,
            maxGenerations,
            weights: network.weights
        });
    });
});
