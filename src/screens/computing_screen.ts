import { WIDTH, HEIGHT, MAX_VELOCITY } from '../constants';
import { FeedForwardNetwork } from '../math/net';
import Screen from '../screens/screen';
import Keyboard from '../game/keyboard';
import Topic from '../observable';
import UnsupervisedLearningScreen from './unsupervised_screen';
import WorkerCommunicator from '../worker_communication';

const FONT_SIZE_PX = 64;

export default class ComputingScreen extends Screen<void> {
    private network: FeedForwardNetwork | undefined = undefined;

    public async load(keyboard: Keyboard, workerCommunicator: WorkerCommunicator): Promise<void> {
        const topic = workerCommunicator.unsupervisedTopic;
        const listener = ([network, generation]: [FeedForwardNetwork, number]) => {
            console.log(`Obtained first neural network from generation ${generation}`);
            topic.unsubscribe(listener);
            this.network = network;
        };
        topic.subscribe(listener);
        workerCommunicator.startUnsupervisedLearning();
    }

    public update(ctx: CanvasRenderingContext2D): Screen<any> | undefined {
        this.render(ctx);
        if (this.network) {
            return new UnsupervisedLearningScreen({ neuralNetwork: this.network });
        } else {
            return undefined;
        }
    }

    private render(ctx: CanvasRenderingContext2D): void {
        this.clear(ctx);
        ctx.font = `bold ${FONT_SIZE_PX}px sans`;
        ctx.textAlign = "center";
        ctx.fillStyle = 'red';
        ctx.fillText("Teaching", WIDTH / 2, (HEIGHT + FONT_SIZE_PX) / 2);
        return undefined;
    }
}
