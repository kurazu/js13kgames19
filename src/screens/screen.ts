import { WIDTH, HEIGHT } from '../constants';
import Keyboard from '../game/keyboard';
import WorkerCommunicator from '../worker_communication';
import { sum } from '../utils';
import { Toolbox } from '../game/toolbox';

export default abstract class Screen<Options> {
    protected options: Options;
    protected frames: number = 0;

    public constructor(options: Options) {
        this.options = options;
    }

    public abstract init(toolbox: Toolbox): void;
    public abstract update(toolbox: Toolbox): Screen<any> | undefined;

    public loop(toolbox: Toolbox): Screen<any> | undefined {
        try {
            return this.update(toolbox);
        } finally {
            this.frames++;
        }
    }

    protected clear(toolbox: Toolbox): void {
        toolbox.ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }

    protected drawText(
        toolbox: Toolbox,
        text: string, fontSize: number,
        x: number, y: number,
        textAlign: CanvasTextAlign = 'left',
        textColor: string = 'white', bgColor: string = 'black'
    ): void{
        const { ctx } = toolbox;
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

    protected drawColoredText(toolbox: Toolbox, texts: [string, string][], fontSize: number, x: number, y: number, textAlign: CanvasTextAlign = 'center'): void {
        const { ctx } = toolbox;
        ctx.font = `${fontSize}px monospace`;
        const measures = texts.map(([text, color]) => ctx.measureText(text).width);
        const totalMeasure = sum(measures);
        let currentX: number;
        if (textAlign === 'left') {
            currentX = x;
        } else if (textAlign === 'center') {
            currentX = x - totalMeasure / 2;
        } else {
            currentX = x - totalMeasure;
        }
        for (const [idx, [text, color]] of texts.entries()) {
            if (color !== 'transparent') {
                this.drawText(toolbox, text, fontSize, currentX, y, 'left', color);
            }
            currentX += measures[idx];
        }
    }

    protected drawColoredTexts(toolbox: Toolbox, page: [string, string][][], fontSize: number, padding: number, x: number, y: number, textAlign: CanvasTextAlign = 'center'): void {
        for (const [idx, line] of page.entries()) {
            this.drawColoredText(toolbox, line, fontSize, x, (idx + 1) * (fontSize + padding) - padding, textAlign);
        }
    }
}
