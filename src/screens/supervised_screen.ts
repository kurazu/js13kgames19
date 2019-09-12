import { Toolbox } from '../game/toolbox';
import GameScreen from './game_screen';
import ScreenType from './screen_type';
import Topic from '../observable';
import { FeedForwardNetwork } from '../math/net';
import AIShip from '../ships/ai_ship';
import Keyboard from '../game/keyboard';
import PlayerShip from '../ships/player_ship';
import WorkerCommunicator from '../worker_communication';

export default class SupervisedLearningScreen extends GameScreen<PlayerShip> {
    private bot: AIShip | undefined;
    private networkUpdateListener: ([value, generation]: [FeedForwardNetwork, number]) => void;

    public constructor(toolbox: Toolbox) {
        super(toolbox);
        this.networkUpdateListener = this.onNetworkUpdated.bind(this);
        toolbox.workerCommunicator.supervisedTopic.subscribe(this.networkUpdateListener);
    }

    protected createPlayer(): PlayerShip {
        return new PlayerShip(this.toolbox.keyboard);
    }

    public onNetworkUpdated([network, generation]: [FeedForwardNetwork, number]): void {
        console.log(`SupervisedScreen obtained updated neural network from generation ${generation + 1}`);
        if (this.bot) {
            this.bot.neuralNetwork = network;
            this.bot.generation = generation + 1;
        } else {
            this.bot = this.createBot(network, generation + 1);
            this.world.addShip(this.bot);
        }
        this.bot.position = this.player.position.clone();
        this.bot.velocity = this.player.velocity.clone();
    }

    private createBot(network: FeedForwardNetwork, generation: number): AIShip {
        return new AIShip(network, generation, 0.005, 60);
    }

    protected onLevelFinished(): ScreenType {
        const { toolbox: { workerCommunicator }, networkUpdateListener } = this;
        workerCommunicator.supervisedTopic.unsubscribe(networkUpdateListener);
        return ScreenType.SUPERVISED;
    }
}
