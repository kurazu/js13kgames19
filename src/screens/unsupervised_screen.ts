import { Toolbox } from '../game/toolbox';
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
}

export default class UnsupervisedLearningScreen extends GameScreen<UnsupervidedLearningScreenOptions, PlayerShip> {
    private bot: AIShip | undefined;
    private networkUpdateListener: ([value, generation]: [FeedForwardNetwork, number]) => void;

    public constructor(options: UnsupervidedLearningScreenOptions) {
        super(options);
        this.networkUpdateListener = this.onNetworkUpdated.bind(this);
    }

    protected createPlayer(toolbox: Toolbox): PlayerShip {
        return new PlayerShip(toolbox.keyboard);
    }

    public onNetworkUpdated([network, generation]: [FeedForwardNetwork, number]): void {
        console.log(`UnsupervisedScreen obtained updated neural network from generation ${generation + 1}`);
        this.bot!.neuralNetwork = network;
        this.bot!.generation = generation + 1;
    }

    public init(toolbox: Toolbox): void {
        super.init(toolbox);
        this.bot = new AIShip(this.options.neuralNetwork, 1, 0.005, 60);
        this.world!.addShip(this.bot);
        toolbox.workerCommunicator.unsupervisedTopic.subscribe(this.networkUpdateListener);
    }

    protected getNextScreen(toolbox: Toolbox): Screen<any> {
        toolbox.workerCommunicator.unsupervisedTopic.unsubscribe(this.networkUpdateListener);
        return new UnsupervisedLearningScreen({
            neuralNetwork: this.bot!.neuralNetwork,
        });
    }
}
