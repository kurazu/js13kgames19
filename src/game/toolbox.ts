import Keyboard from './keyboard';
import WorkerCommunicator from '../worker_communication';
import { generateForeground, generateBackground } from './backgroundGenerator';
import { loadImage } from '../game/resources';
import { WIDTH, HEIGHT } from '../constants';
import { FeedForwardNetwork } from '../math/net';
import { loadNetwork } from './storage';

export interface Toolbox {
    readonly keyboard: Keyboard;
    readonly foregroundImage: CanvasImageSource;
    readonly backgroundImage: CanvasImageSource;
    readonly tilesImage: CanvasImageSource;
    readonly workerCommunicator: WorkerCommunicator;
    readonly canvas: HTMLCanvasElement;
    readonly ctx: CanvasRenderingContext2D;
    neuralNetwork: FeedForwardNetwork | undefined;
    generation: number;
    step: number;
    totalSteps: number;
}

export async function loadToolbox(canvas: HTMLCanvasElement): Promise<Toolbox> {
    const workerCommunicator = new WorkerCommunicator();
    const keyboard = new Keyboard();
    const foregroundImage = await generateForeground();
    const backgroundImage = await generateBackground();
    const tilesImage = await loadImage('img/tiles.png');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const ctx = canvas.getContext('2d')!;
    keyboard.start();
    const [neuralNetwork, generation] = loadNetwork();
    const toolbox: Toolbox = {
        canvas, ctx,
        workerCommunicator, keyboard,
        foregroundImage, backgroundImage, tilesImage,
        neuralNetwork,
        generation,
        step: 0,
        totalSteps: 0
    };
    workerCommunicator.progressTopic.subscribe(([step, totalSteps]) => {
        toolbox.step = step;
        toolbox.totalSteps = totalSteps;
    });
    workerCommunicator.readyTopic.subscribe(([network, generation]) => {
        toolbox.step = toolbox.totalSteps;
        toolbox.neuralNetwork = network;
        toolbox.generation = generation;
    });
    return toolbox;
}
