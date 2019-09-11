import { WIDTH } from '../constants';
import Screen from '../screens/screen';
import Keyboard from '../game/keyboard';
import WorkerCommunicator from '../worker_communication';
import { generateForeground, generateBackground } from '../game/backgroundGenerator';
import { Toolbox } from '../game/toolbox';

export default abstract class BackgroundScreen<T> extends Screen<T> {

    protected drawBackground(toolbox: Toolbox, screenLeft: number): void {
        const { ctx } = toolbox;
        const foregroundFactor = - 1 / 3;
        const backgroundFactor = - 1 / 12;
        const fgIndex = ~~(screenLeft * foregroundFactor % WIDTH);
        const bgIndex = ~~(screenLeft * backgroundFactor % WIDTH);
        ctx.drawImage(toolbox.backgroundImage!, bgIndex, 0);
        ctx.drawImage(toolbox.backgroundImage!, bgIndex + WIDTH, 0);
        ctx.drawImage(toolbox.foregroundImage!, fgIndex, 0);
        ctx.drawImage(toolbox.foregroundImage!, fgIndex + WIDTH, 0);
    }
}
