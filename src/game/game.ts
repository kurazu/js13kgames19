import Screen from '../screens/screen';
import Keyboard from './keyboard';
import { WIDTH, HEIGHT } from '../constants';

export default class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private screen: Screen<any>;
    private keyboard: Keyboard;

    public constructor(canvas: HTMLCanvasElement, initialScreen: Screen<any>) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.screen = initialScreen;
        this.keyboard = new Keyboard();

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
        screen.load(this.keyboard).then(
            _ => { requestAnimationFrame(this.loop); },
            err => { console.error('Failed to load screen', screen, err); }
        );
    }

    private loop(): void {
        const nextScreen: Screen<any> | undefined = this.screen.update(this.ctx);
        if (nextScreen) {
            this.loadScreen(nextScreen);
        } else {
            requestAnimationFrame(this.loop);
        }
    }
}
