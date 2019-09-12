import { WIDTH, HEIGHT } from '../constants';
import Keyboard from '../game/keyboard';
import WorkerCommunicator from '../worker_communication';
import { sum } from '../utils';
import { Toolbox } from '../game/toolbox';
import ScreenType from './screen_type';
import { Line, Page } from './text';

export default abstract class Screen {
    protected toolbox: Toolbox;
    protected frames: number = 0;

    public constructor(toolbox: Toolbox) {
        this.toolbox = toolbox;
    }

    protected abstract update(): ScreenType | undefined;

    public loop(): ScreenType | undefined {
        try {
            return this.update();
        } finally {
            this.frames++;
        }
    }

    protected clear(): void {
        this.toolbox.ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }

    protected drawText(
        text: string, fontSize: number,
        x: number, y: number,
        textAlign: CanvasTextAlign = 'left',
        textColor: string = 'white', bgColor: string = 'black'
    ): void{
        const { ctx } = this.toolbox;
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

    protected drawColoredText(texts: Line, fontSize: number, x: number, y: number, textAlign: CanvasTextAlign = 'center'): void {
        const { ctx } = this.toolbox;
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
                this.drawText(text, fontSize, currentX, y, 'left', color);
            }
            currentX += measures[idx];
        }
    }

    protected drawColoredTexts(page: Page, fontSize: number, padding: number, x: number, y: number, textAlign: CanvasTextAlign = 'center'): void {
        for (const [idx, line] of page.entries()) {
            this.drawColoredText(line, fontSize, x, (idx + 1) * (fontSize + padding) - padding, textAlign);
        }
    }
}
