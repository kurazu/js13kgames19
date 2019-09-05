import Topic from '../observable';
import { FeedForwardNetwork } from '../math/net';
import { createNetwork } from './game_genetic';
import WorkerData from '../worker_interface';

export default function learnInBackground(): Topic<[FeedForwardNetwork, number]> {
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
