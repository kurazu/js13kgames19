import Topic from '../observable';
import { FeedForwardNetwork } from '../math/net';
import { createNetwork } from './game_genetic';

export default function learnInBackground(): Topic<FeedForwardNetwork> {
    const topic: Topic<FeedForwardNetwork> = new Topic();
    const worker = new Worker('dist/worker.js');

    worker.addEventListener('message', (event: MessageEvent) => {
        console.log('Recieved new weights from worker');
        const weights: Float32Array = event.data;
        const network = createNetwork(weights);
        topic.next(network);
    });

    // Initialize calculations.
    worker.postMessage({});

    return topic;
}
