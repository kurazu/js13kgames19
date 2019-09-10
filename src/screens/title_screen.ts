import { WIDTH, HEIGHT, FPS } from '../constants';
import Keyboard from '../game/keyboard';
import WorkerCommunicator from '../worker_communication';
import Screen from './screen';
import BackgroundScreen from './background_screen';

const FONT_SIZE_PX = 64;
const SECONDS_OF_ANIMATION = 3;
const FRAMES_OF_ANIMATION = SECONDS_OF_ANIMATION * FPS;

export default class TitleScreen extends BackgroundScreen<void> {
    private wasPressedFrame: number = 0;

    public update(ctx: CanvasRenderingContext2D, workerCommunicator: WorkerCommunicator, keyboard: Keyboard): Screen<any> | undefined {
        this.render(ctx);
        if (this.wasPressedFrame) {
            if ( this.frames > this.wasPressedFrame + FRAMES_OF_ANIMATION) {
                return new TitleScreen();
            }
        } else if (keyboard.isAnyPressed()) {
            this.wasPressedFrame = this.frames;
        }
        return undefined;
    }

    private render(ctx: CanvasRenderingContext2D): void {
        const centerY = HEIGHT / 2 + FONT_SIZE_PX / 2;
        const textPeriod = FPS * 2;
        const yOffset = Math.sin(Math.PI * 2 * this.frames / textPeriod) * 10;
        this.clear(ctx);
        const frameOfAnimation: number = this.wasPressedFrame ? this.frames - this.wasPressedFrame : 0;
        this.drawBackground(ctx, this.frames * (10 + frameOfAnimation / FRAMES_OF_ANIMATION * 30));
        this.drawText(
            ctx, 'THE BACKUP PILOT', FONT_SIZE_PX,
            WIDTH / 2, centerY + yOffset, 'center',
        );
        this.drawText(
            ctx, 'by kurazu', FONT_SIZE_PX / 2,
            WIDTH / 2, centerY + yOffset + 50, 'center'
        );
        if (!this.wasPressedFrame) {
            if ((~~(this.frames / FPS * 2)) % 2) {
                this.drawText(
                    ctx, 'PRESS ANY ARROW TO START', FONT_SIZE_PX / 2,
                    WIDTH / 2, HEIGHT - 50, 'center'
                );
            }
        }
    }
}





