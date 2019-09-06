import Screen from './screen';
import GameScreen from './game_screen';
import RecordingShip from '../ships/recording_ship';
import Keyboard from '../game/keyboard';

export interface RecordingScreenOptions {

}

export default class RecordingScreen extends GameScreen<RecordingScreenOptions, RecordingShip> {
    protected getNextScreen(): Screen<any> {
        console.log('Gathered', this.player!.records.length, 'records');
        return new RecordingScreen(this.options);
    }

    protected createPlayer(keyboard: Keyboard): RecordingShip {
        return new RecordingShip(keyboard);
    }
}
