import { getSupervisedOptimizer, getInitializedUnsupervisedOptimizer } from './learning/learn';
import NeuralGeneticAlgorithm from './learning/neural_genetic';
import Topic from './observable';
import { FeedForwardNetwork } from './math/net';
import { WorkerResponse, WorkerRequest, ResponseType, ProgressResponse, ReadyResponse } from './worker_interface';
import { SUPERVISED_GENERATIONS, UNSUPERVISED_GENERATIONS } from './constants';

const ctx: Worker = self as any;

ctx.addEventListener('message', function(evt: MessageEvent) {
    console.log('Worker received a message');
    const request: WorkerRequest = evt.data;
    const inputs = new Float32Array(request.inputs);
    const labels = new Uint8Array(request.labels);
    const totalSteps: number = SUPERVISED_GENERATIONS + UNSUPERVISED_GENERATIONS;

    const supervisedOptimizer = getSupervisedOptimizer(inputs, labels);
    supervisedOptimizer.topic.subscribe(update => {
        const response: ProgressResponse = {
            "type": ResponseType.PROGRESS,
            "step": update.generation,
            "totalSteps": totalSteps,
        };
        ctx.postMessage(response);
    });
    const network = supervisedOptimizer.evolveBest();
    const unsupervisedOptimizer = getInitializedUnsupervisedOptimizer(network);
    unsupervisedOptimizer.topic.subscribe(update => {
        let response: WorkerResponse;
        const generation = SUPERVISED_GENERATIONS + update.generation
        if (update.satisfactory) {
            response = {
                "type": ResponseType.READY,
                "weights": update.bestSolution.weights,
                "generation": generation
            } as ReadyResponse;
        } else {
            response = {
                "type": ResponseType.PROGRESS,
                "step": generation,
                "totalSteps": totalSteps
            } as ProgressResponse;
        }
        ctx.postMessage(response);
    });
    unsupervisedOptimizer.evolveBest();
    console.log('Worker finished operation');
});
