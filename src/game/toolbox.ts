import Keyboard from './keyboard';
import WorkerCommunicator from '../worker_communication';
import { generateForeground, generateBackground } from './backgroundGenerator';
import { loadImage } from '../game/resources';
import { WIDTH, HEIGHT } from '../constants';
import { FeedForwardNetwork } from '../math/net';

export interface Toolbox {
    readonly keyboard: Keyboard;
    readonly foregroundImage: CanvasImageSource;
    readonly backgroundImage: CanvasImageSource;
    readonly shipImage: CanvasImageSource;
    readonly tilesImage: CanvasImageSource;
    readonly workerCommunicator: WorkerCommunicator;
    readonly canvas: HTMLCanvasElement;
    readonly ctx: CanvasRenderingContext2D;
    neuralNetwork: FeedForwardNetwork | undefined;
    generation: number;
}

export async function loadToolbox(canvas: HTMLCanvasElement): Promise<Toolbox> {
    const workerCommunicator = new WorkerCommunicator();
    const keyboard = new Keyboard();
    const foregroundImage = await generateForeground();
    const backgroundImage = await generateBackground();
    const [shipImage, tilesImage] = await Promise.all([loadImage('img/ship.png'), loadImage('img/tiles.png')])
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const ctx = canvas.getContext('2d')!;
    keyboard.start();
    const neuralNetwork = undefined;
    const generation = 0;
    return {
        canvas, ctx,
        workerCommunicator, keyboard,
        foregroundImage, backgroundImage, shipImage, tilesImage,
        neuralNetwork, generation
    };
}
