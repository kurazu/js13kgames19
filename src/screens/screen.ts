import { WIDTH, HEIGHT } from '../constants';
import Keyboard from '../game/keyboard';

export default abstract class Screen<Options> {
    protected options: Options;

    public constructor(options: Options) {
        this.options = options;
    }

    public abstract async load(keyboard: Keyboard): Promise<void>;
    public abstract update(ctx: CanvasRenderingContext2D): Screen<any> | undefined;

    protected clear(ctx: CanvasRenderingContext2D): void {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }
}
