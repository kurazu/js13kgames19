import { Toolbox } from '../game/toolbox';
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
    generation: number
}

export default class SupervisedLearningScreen extends GameScreen<SupervidedLearningScreenOptions, PlayerShip> {
    private bot: AIShip | undefined;
    private networkUpdateListener: ([value, generation]: [FeedForwardNetwork, number]) => void;

    public constructor(options: SupervidedLearningScreenOptions) {
        super(options);
        this.networkUpdateListener = this.onNetworkUpdated.bind(this);
    }

    protected createPlayer(toolbox: Toolbox): PlayerShip {
        return new PlayerShip(toolbox.keyboard);
    }

    public onNetworkUpdated([network, generation]: [FeedForwardNetwork, number]): void {
        console.log(`SupervisedScreen obtained updated neural network from generation ${generation + 1}`);
        if (this.bot) {
            this.bot.neuralNetwork = network;
            this.bot.generation = generation + 1;
        } else {
            this.bot = this.createBot(network, generation + 1);
            this.world!.addShip(this.bot);
        }
        this.bot.position = this.player!.position.clone();
        this.bot.velocity = this.player!.velocity.clone();
    }

    private createBot(network: FeedForwardNetwork, generation: number): AIShip {
        return new AIShip(network, generation, 0.005, 60);
    }

    public init(toolbox: Toolbox): void {
        toolbox.workerCommunicator.supervisedTopic.subscribe(this.networkUpdateListener);
        super.init(toolbox);
        if (this.options.neuralNetwork) {
            this.bot = this.createBot(this.options.neuralNetwork, this.options.generation);
            this.world!.addShip(this.bot);
        }
    }

    protected getNextScreen(toolbox: Toolbox): Screen<any> {
        toolbox.workerCommunicator.supervisedTopic.unsubscribe(this.networkUpdateListener);
        const neuralNetwork = this.bot ? this.bot.neuralNetwork : null;
        const generation = this.bot ? this.bot.generation : 0;
        return new SupervisedLearningScreen({
            neuralNetwork,
            generation
        });
    }
}
