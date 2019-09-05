import Topic from '../observable';
import { FeedForwardNetwork } from '../math/net';

export default function learnInBackground(): Topic<FeedForwardNetwork> {
    const topic: Topic<FeedForwardNetwork> = new Topic();
    const worker = new Worker('dist/worker.js');

    worker.addEventListener('message', (event: MessageEvent) => {
        const network: FeedForwardNetwork = event.data;
        topic.next(network);
    });

    // Initialize calculations.
    worker.postMessage({});

    return topic;
}
