import { WIDTH } from '../constants';
import Screen from '../screens/screen';
import Keyboard from '../game/keyboard';
import WorkerCommunicator from '../worker_communication';
import { generateForeground, generateBackground } from '../game/backgroundGenerator';

export default abstract class BackgroundScreen<T> extends Screen<T> {
    protected foregroundImage: CanvasImageSource | undefined;
    protected backgroundImage: CanvasImageSource | undefined;

     public async load(keyboard: Keyboard, workerCommunicator: WorkerCommunicator): Promise<void> {
        this.foregroundImage = await generateForeground();
        this.backgroundImage = await generateBackground();
    }

    protected drawBackground(ctx: CanvasRenderingContext2D, screenLeft: number): void {
        const foregroundFactor = - 1 / 3;
        const backgroundFactor = - 1 / 12;
        const fgIndex = ~~(screenLeft * foregroundFactor % WIDTH);
        const bgIndex = ~~(screenLeft * backgroundFactor % WIDTH);
        ctx.drawImage(this.backgroundImage!, bgIndex, 0);
        ctx.drawImage(this.backgroundImage!, bgIndex + WIDTH, 0);
        ctx.drawImage(this.foregroundImage!, fgIndex, 0);
        ctx.drawImage(this.foregroundImage!, fgIndex + WIDTH, 0);
    }
}
