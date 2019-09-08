import GameScreen from './game_screen';
import Topic from '../observable';
import { FeedForwardNetwork } from '../math/net';
import AIShip from '../ships/ai_ship';
import Keyboard from '../game/keyboard';
import Screen from './screen';
import PlayerShip from '../ships/player_ship';
import WorkerCommunicator from '../worker_communication';

interface SupervidedLearningScreenOptions {
    neuralNetwork: FeedForwardNetwork | null,
}

export default class SupervisedLearningScreen extends GameScreen<SupervidedLearningScreenOptions, PlayerShip> {
    private bot: AIShip | undefined;
    private networkUpdateListener: ([value, generation]: [FeedForwardNetwork, number]) => void;

    public constructor(options: SupervidedLearningScreenOptions) {
        super(options);
        this.networkUpdateListener = this.onNetworkUpdated.bind(this);
    }

    protected createPlayer(keyboard: Keyboard): PlayerShip {
        return new PlayerShip(keyboard);
    }

    public onNetworkUpdated([network, generation]: [FeedForwardNetwork, number]): void {
        console.log(`SupervisedScreen obtained updated neural network from generation ${generation + 1}`);
        if (this.bot) {
            this.bot.neuralNetwork = network;
        } else {
            this.bot = new AIShip(network);
            this.world!.addShip(this.bot);
        }
        this.bot.position = this.player!.position.clone();
        this.bot.velocity = this.player!.velocity.clone();
    }

    public async load(keyboard: Keyboard, workerCommunicator: WorkerCommunicator): Promise<void> {
        workerCommunicator.supervisedTopic.subscribe(this.networkUpdateListener);
        await super.load(keyboard, workerCommunicator);
        if (this.options.neuralNetwork) {
            this.bot = new AIShip(this.options.neuralNetwork);
            this.world!.addShip(this.bot);
        }
    }

    protected getNextScreen(workerCommunicator: WorkerCommunicator): Screen<any> {
        workerCommunicator.supervisedTopic.unsubscribe(this.networkUpdateListener);
        const neuralNetwork = this.bot ? this.bot.neuralNetwork : null;
        return new SupervisedLearningScreen({
            neuralNetwork
        });
    }
}
