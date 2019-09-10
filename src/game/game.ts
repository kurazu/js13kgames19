import Screen from '../screens/screen';
import Keyboard from './keyboard';
import { WIDTH, HEIGHT } from '../constants';
import WorkerCommunicator from '../worker_communication';

export default class Game {
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;
    private screen: Screen<any>;
    private readonly keyboard: Keyboard;
    private readonly workerCommunicator: WorkerCommunicator;

    public constructor(canvas: HTMLCanvasElement, initialScreen: Screen<any>) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.screen = initialScreen;
        this.keyboard = new Keyboard();
        this.workerCommunicator = new WorkerCommunicator();

        this.loop = this.loop.bind(this);
    }

    public async start(): Promise<void> {
        console.log('Starting game');
        this.canvas.width = WIDTH;
        this.canvas.height = HEIGHT;
        this.keyboard.start();
        this.loadScreen(this.screen);
    }

    private loadScreen(screen: Screen<any>): void {
        console.log('Loading screen', screen);
        this.screen = screen;
        screen.load(this.keyboard, this.workerCommunicator).then(
            _ => { requestAnimationFrame(this.loop); },
            err => { console.error('Failed to load screen', screen, err); }
        );
    }

    private loop(): void {
        const nextScreen: Screen<any> | undefined = this.screen.loop(this.ctx, this.workerCommunicator, this.keyboard);
        if (nextScreen) {
            this.loadScreen(nextScreen);
        } else {
            requestAnimationFrame(this.loop);
        }
    }
}
