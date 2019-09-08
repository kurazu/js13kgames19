import { WIDTH, HEIGHT } from '../constants';
import Keyboard from '../game/keyboard';
import WorkerCommunicator from '../worker_communication';

export default abstract class Screen<Options> {
    protected options: Options;

    public constructor(options: Options) {
        this.options = options;
    }

    public abstract async load(keyboard: Keyboard, workerCommunicator: WorkerCommunicator): Promise<void>;
    public abstract update(ctx: CanvasRenderingContext2D, workerCommunicator: WorkerCommunicator): Screen<any> | undefined;

    protected clear(ctx: CanvasRenderingContext2D): void {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }
}
