import { Toolbox } from '../game/toolbox';
import GameScreen from './game_screen';
import Topic from '../observable';
import { FeedForwardNetwork } from '../math/net';
import AIShip from '../ships/ai_ship';
import Keyboard from '../game/keyboard';
import ScreenType from './screen_type';
import PlayerShip from '../ships/player_ship';
import WorkerCommunicator from '../worker_communication';

interface UnsupervidedLearningScreenOptions {
    neuralNetwork: FeedForwardNetwork,
}

export default class UnsupervisedLearningScreen extends GameScreen<PlayerShip> {
    private bot: AIShip;
    private networkUpdateListener: ([value, generation]: [FeedForwardNetwork, number]) => void;

    public constructor(toolbox: Toolbox) {
        super(toolbox);
        this.networkUpdateListener = this.onNetworkUpdated.bind(this);
        this.bot = new AIShip(this.toolbox.neuralNetwork!, 1, 0.005, 60);
        this.world.addShip(this.bot);
        toolbox.workerCommunicator.unsupervisedTopic.subscribe(this.networkUpdateListener);
    }

    protected createPlayer(): PlayerShip {
        return new PlayerShip(this.toolbox.keyboard);
    }

    public onNetworkUpdated([network, generation]: [FeedForwardNetwork, number]): void {
        console.log(`UnsupervisedScreen obtained updated neural network from generation ${generation + 1}`);
        this.bot!.neuralNetwork = network;
        this.bot!.generation = generation + 1;
    }

    protected onLevelFinished(): ScreenType {
        this.toolbox.workerCommunicator.unsupervisedTopic.unsubscribe(this.networkUpdateListener);
        return ScreenType.UNSUPERVISED;
    }
}
