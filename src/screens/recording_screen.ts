import Screen from './screen';
import GameScreen from './game_screen';
import PlayerShip from '../ships/player_ship';
import Keyboard from '../game/keyboard';

export interface RecordingScreenOptions {

}

export default class RecordingScreen extends GameScreen<RecordingScreenOptions, PlayerShip> {
    protected getNextScreen(): Screen<any> {
        return new RecordingScreen(this.options);
    }

    protected createPlayer(keyboard: Keyboard): PlayerShip {
        return new PlayerShip(keyboard);
    }
}
