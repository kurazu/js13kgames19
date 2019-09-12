import { WIDTH } from '../constants';
import Screen from '../screens/screen';

export default abstract class BackgroundScreen extends Screen {

    protected drawBackground(screenLeft: number): void {
        const { ctx, backgroundImage, foregroundImage } = this.toolbox;
        const foregroundFactor = - 1 / 3;
        const backgroundFactor = - 1 / 12;
        const fgIndex = ~~(screenLeft * foregroundFactor % WIDTH);
        const bgIndex = ~~(screenLeft * backgroundFactor % WIDTH);
        ctx.drawImage(backgroundImage, bgIndex, 0);
        ctx.drawImage(backgroundImage, bgIndex + WIDTH, 0);
        ctx.drawImage(foregroundImage, fgIndex, 0);
        ctx.drawImage(foregroundImage, fgIndex + WIDTH, 0);
    }
}
