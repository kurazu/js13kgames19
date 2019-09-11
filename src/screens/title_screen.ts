import { Toolbox } from '../game/toolbox';
import { WIDTH, HEIGHT, FPS } from '../constants';
import Keyboard from '../game/keyboard';
import WorkerCommunicator from '../worker_communication';
import Screen from './screen';
import MenuScreen, { ItemCallback } from './menu_screen';
import IntroScreen from './intro_screen';
import { normal as N, emphasis as E, standout as S } from './text';

const FONT_SIZE_PX = 64;

export default class TitleScreen extends MenuScreen<void> {
    protected getItems(toolbox: Toolbox): [string, boolean, ItemCallback][] {
        return [
            ['CONTINUE', false, this.onContinue.bind(this)],
            ['NEW GAME', true, this.onNewGame.bind(this)],
        ];
    }

    onContinue(toolbox: Toolbox): Screen<any> | undefined {
        throw new Error('Not implemented');
    }

    onNewGame(toolbox: Toolbox): Screen<any> | undefined {
        return new IntroScreen({ page: 0});
    }

    public update(toolbox: Toolbox): Screen<any> | undefined {
        const nextScreen = super.update(toolbox);
        this.render(toolbox);
        return nextScreen;
    }

    private render(toolbox: Toolbox): void {
        const centerY = HEIGHT / 2 - 150;
        const textPeriod = FPS * 2;
        const yOffset = Math.sin(Math.PI * 2 * this.frames / textPeriod) * 10;
        this.clear(toolbox);
        this.drawBackground(toolbox, this.frames * 10);
        this.drawColoredText(
            toolbox, [N('THE '), E('BACK'), N('-UP OF '), E('YOU')],
            FONT_SIZE_PX, WIDTH / 2, centerY + yOffset
        );
        this.drawColoredText(
            toolbox, [N('by '), S('kurazu')],
            FONT_SIZE_PX / 2, WIDTH / 2, centerY + yOffset + 50
        );
        this.renderItems(toolbox, FONT_SIZE_PX / 2, 10, HEIGHT / 2 + 50);
        this.renderHelp(toolbox, ~~(FONT_SIZE_PX / 3), HEIGHT - 70);
    }
}
