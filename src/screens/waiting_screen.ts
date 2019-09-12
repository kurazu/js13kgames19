import GameScreen from './game_screen';
import ScreenType from './screen_type';
import PlayerShip from '../ships/player_ship';
import { TARGET_AIRMILES, WIDTH } from '../constants';
import { Line, normal as N, standout as S} from './text';

export default class WaitingScreen extends GameScreen<PlayerShip> {
    protected createPlayer() {
        return new PlayerShip(this.toolbox.keyboard);
    }

    private getAirmiles(): number {
        const factor = this.toolbox.step / this.toolbox.totalSteps;
        if (isNaN(factor)) {
            return 0;
        } else {
            return factor * TARGET_AIRMILES;
        }
    }

    protected drawHUD(): void {
        super.drawHUD();
        this.drawAirmiles();
    }

    protected onLevelFinished(): ScreenType {
        return ScreenType.WAITING;
    }

    private drawAirmiles(): void {
        const fontSizePx: number = 24;
        const texts: Line = [
            N('Airmiles: '),
            S(this.getAirmiles().toFixed(1).padStart(3, '0')),
            N(`/${TARGET_AIRMILES}`),
        ]
        this.drawColoredText(
            texts,
            fontSizePx, WIDTH - 2, fontSizePx * 2 + 4, 'right'
        );
    }
}
