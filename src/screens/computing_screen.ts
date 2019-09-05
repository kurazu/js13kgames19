import { WIDTH, HEIGHT, MAX_VELOCITY } from '../constants';
import { FeedForwardNetwork } from '../math/net';
import Screen from '../screens/screen';
import Keyboard from '../game/keyboard';
import learnInBackground from '../learning/background_calculation';
import Topic from '../observable';
import GameScreen from './game_screen';

const FONT_SIZE_PX = 64;

export default class ComputingScreen extends Screen<void> {
    private network: FeedForwardNetwork | undefined = undefined;
    private topic: Topic<FeedForwardNetwork> | undefined = undefined;

    public async load(keyboard: Keyboard): Promise<void> {
        this.topic = learnInBackground();
        const listener = (network: FeedForwardNetwork) => {
            this.topic!.unsubscribe(listener);
            this.network = network;
        };
        this.topic.subscribe(listener);
    }

    public update(ctx: CanvasRenderingContext2D): Screen<any> | undefined {
        this.render(ctx);
        if (this.network) {
            return new GameScreen({ neuralNetwork: this.network, networkUpdatesTopic: this.topic! });
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
