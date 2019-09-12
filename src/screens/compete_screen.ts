import { Queue } from '../math/queue';
import { Toolbox } from '../game/toolbox';
import GameScreen, { RENDER_PAST_POSITIONS } from './game_screen';
import ScreenType from './screen_type';
import Topic from '../observable';
import { FeedForwardNetwork } from '../math/net';
import AIShip from '../ships/ai_ship';
import Keyboard from '../game/keyboard';
import PlayerShip from '../ships/player_ship';
import WorkerCommunicator from '../worker_communication';
import { FPS } from '../constants';

export default class CompeteScreen extends GameScreen<PlayerShip> {
    private bot: AIShip;

    public constructor(toolbox: Toolbox) {
        super(toolbox);
        this.bot = new AIShip(toolbox.neuralNetwork!, toolbox.generation, 0.005, FPS * 1);
        this.world.addShip(this.bot);
        this.shipPastPositions.set(this.bot, new Queue(RENDER_PAST_POSITIONS));
    }

    protected createPlayer(): PlayerShip {
        return new PlayerShip(this.toolbox.keyboard);
    }

    protected isPlayerWinning(): boolean {
        return this.player.position.x >= this.bot.position.x;
    }

    protected onLevelFinished(): ScreenType {
        if (this.isPlayerWinning()) {
            return ScreenType.WON;
        } else {
            return ScreenType.LOST;
        }
    }
}
