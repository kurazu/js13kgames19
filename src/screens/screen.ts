import { WIDTH, HEIGHT } from '../constants';
import Keyboard from '../game/keyboard';
import WorkerCommunicator from '../worker_communication';
import { sum } from '../utils';

export default abstract class Screen<Options> {
    protected options: Options;
    protected frames: number = 0;

    public constructor(options: Options) {
        this.options = options;
    }

    public abstract async load(keyboard: Keyboard, workerCommunicator: WorkerCommunicator): Promise<void>;
    protected abstract update(ctx: CanvasRenderingContext2D, workerCommunicator: WorkerCommunicator, keyboard: Keyboard): Screen<any> | undefined;

    public loop(ctx: CanvasRenderingContext2D, workerCommunicator: WorkerCommunicator, keyboard: Keyboard): Screen<any> | undefined {
        try {
            return this.update(ctx, workerCommunicator, keyboard);
        } finally {
            this.frames++;
        }
    }

    protected clear(ctx: CanvasRenderingContext2D): void {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }

    protected drawText(
        ctx: CanvasRenderingContext2D,
        text: string, fontSize: number,
        x: number, y: number,
        textAlign: CanvasTextAlign = 'left',
        textColor: string = 'white', bgColor: string = 'black'
    ): void{
        ctx.font = `${fontSize}px monospace`;
        ctx.textAlign = textAlign;
        ctx.fillStyle = bgColor;
        const range = [-1, 0, 1];
        for (const xDiff of range) {
            for (const yDiff of range) {
                ctx.fillText(text, x - xDiff, y - yDiff);
            }
        }
        ctx.fillStyle = textColor;
        ctx.fillText(text, x, y);
    }

    protected drawColoredText(ctx: CanvasRenderingContext2D, texts: [string, string][], fontSize: number, x: number, y: number) {
        ctx.font = `${fontSize}px monospace`;
        const measures = texts.map(([text, color]) => ctx.measureText(text).width);
        const totalMeasure = sum(measures);
        let currentX = x - totalMeasure / 2;
        for (const [idx, [text, color]] of texts.entries()) {
            this.drawText(ctx, text, fontSize, currentX, y, 'left', color);
            currentX += measures[idx];
        }
    }
}
