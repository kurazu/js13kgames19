import { Toolbox } from '../game/toolbox';
import { WIDTH, HEIGHT, FPS } from '../constants';
import Keyboard from '../game/keyboard';
import WorkerCommunicator from '../worker_communication';
import ScreenType from './screen_type';
import MenuScreen, { ItemCallback, ItemType } from './menu_screen';
import { normal as N, emphasis as E, standout as S } from './text';

const FONT_SIZE_PX = 64;

export default class TitleScreen extends MenuScreen {
    protected getItems(): ItemType[] {
        return [
            ['CONTINUE', this.toolbox.neuralNetwork !== undefined, this.onContinue.bind(this)],
            ['NEW GAME', true, this.onNewGame.bind(this)],
            ['CREDITS', true, this.onCredits.bind(this)],
        ];
    }

    private onContinue(): ScreenType | undefined {
        return ScreenType.COMPETE;
    }

    private onNewGame(): ScreenType | undefined {
        return ScreenType.INTRO;
    }

    private onCredits(): ScreenType | undefined {
        return ScreenType.CREDITS;
    }

    protected update(): ScreenType | undefined {
        const nextScreen = super.update();
        this.render();
        return nextScreen;
    }

    private render(): void {
        const centerY = HEIGHT / 2 - 150;
        const textPeriod = FPS * 2;
        const yOffset = Math.sin(Math.PI * 2 * this.frames / textPeriod) * 10;
        this.clear();
        this.drawBackground(this.frames * 10);
        this.drawColoredText(
            [N('THE '), E('BACK'), N('-UP OF '), E('YOU')],
            FONT_SIZE_PX, WIDTH / 2, centerY + yOffset
        );
        this.drawColoredText(
            [N('by '), S('kurazu')],
            FONT_SIZE_PX / 2, WIDTH / 2, centerY + yOffset + 50
        );
        this.renderItems(FONT_SIZE_PX / 2, 10, HEIGHT / 2 + 50);
        this.renderHelp(~~(FONT_SIZE_PX / 3), HEIGHT - 70);
    }
}
