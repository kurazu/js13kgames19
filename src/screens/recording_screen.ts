import { Matrix2D } from '../math/multiply';
import Screen from './screen';
import GameScreen from './game_screen';
import RecordingShip from '../ships/recording_ship';
import SupervisedLearningScreen from './supervised_screen';
import Keyboard from '../game/keyboard';
import WorkerCommunicator from '../worker_communication';
import { getStackedFeatures } from '../learning/features';

export interface RecordingScreenOptions {

}

export default class RecordingScreen extends GameScreen<RecordingScreenOptions, RecordingShip> {
    protected getNextScreen(workerCommunicator: WorkerCommunicator): Screen<any> {
        const records = this.player!.records;
        console.log(`Gathered ${records.length} records`);
        const [inputMatrix, labels]: [Matrix2D, Uint8Array] = getStackedFeatures(records);
        workerCommunicator.startSupervisedLearning(inputMatrix, labels);
        return new SupervisedLearningScreen({
            neuralNetwork: null
        });
    }

    protected createPlayer(keyboard: Keyboard): RecordingShip {
        return new RecordingShip(keyboard);
    }
}
