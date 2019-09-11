import Screen from '../screens/screen';
import { Toolbox, loadToolbox } from './toolbox';

export default async function start(canvas: HTMLCanvasElement, initialScreen: Screen<any>): Promise<void> {
    const toolbox: Toolbox = await loadToolbox(canvas);
    let screen: Screen<any> = initialScreen;

    requestAnimationFrame(loop);

    function loop(): void {
        const nextScreen: Screen<any> | undefined = screen.loop(toolbox);
        if (nextScreen) {
            screen = nextScreen;
            screen.init(toolbox);
        }
        requestAnimationFrame(loop);
    }
}
