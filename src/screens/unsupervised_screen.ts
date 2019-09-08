import GameScreen from './game_screen';
import Topic from '../observable';
import { FeedForwardNetwork } from '../math/net';
import AIShip from '../ships/ai_ship';
import Keyboard from '../game/keyboard';
import Screen from './screen';
import PlayerShip from '../ships/player_ship';
import WorkerCommunicator from '../worker_communication';

interface UnsupervidedLearningScreenOptions {
    neuralNetwork: FeedForwardNetwork,
    networkUpdatesTopic: Topic<[FeedForwardNetwork, number]>
}

export default class UnsupervisedLearningScreen extends GameScreen<UnsupervidedLearningScreenOptions, PlayerShip> {
    private bot: AIShip | undefined;
    private networkUpdateListener: ([value, generation]: [FeedForwardNetwork, number]) => void;

    public constructor(options: UnsupervidedLearningScreenOptions) {
        super(options);
        this.networkUpdateListener = this.onNetworkUpdated.bind(this);
        this.options.networkUpdatesTopic.subscribe(this.networkUpdateListener);
    }

    protected createPlayer(keyboard: Keyboard): PlayerShip {
        return new PlayerShip(keyboard);
    }

    public onNetworkUpdated([network, generation]: [FeedForwardNetwork, number]): void {
        console.log(`GameScreen obtained updated neural network from generation ${generation + 1}`);
        this.bot!.neuralNetwork = network;
    }

    public async load(keyboard: Keyboard, workerCommunicator: WorkerCommunicator): Promise<void> {
        await super.load(keyboard, workerCommunicator);
        this.bot = new AIShip(this.options.neuralNetwork, 0);
        this.world!.addShip(this.bot);
    }

    protected getNextScreen(): Screen<any> {
        this.options.networkUpdatesTopic.unsubscribe(this.networkUpdateListener);
        return new UnsupervisedLearningScreen({
            neuralNetwork: this.bot!.neuralNetwork,
            networkUpdatesTopic: this.options.networkUpdatesTopic
        });
    }
}
