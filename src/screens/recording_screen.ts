import { Matrix2D } from '../math/multiply';
import Screen from './screen';
import GameScreen from './game_screen';
import RecordingShip from '../ships/recording_ship';
import SupervisedLearningScreen from './supervised_screen';
import Keyboard from '../game/keyboard';
import WorkerCommunicator from '../worker_communication';
import { getStackedFeatures } from '../learning/features';
import { DEFAULT_LEVEL_LENGTH } from '../constants';

export interface RecordingScreenOptions {

}

function store(inputMatrix: Matrix2D, labels: Uint8Array) {
    const blob = new Blob([inputMatrix.buffer.buffer, labels.buffer], {type: 'application/octet-stream'});
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.innerText = 'DOWNLOAD';
    document.body.appendChild(a);

    a.href = url;
    a.download = `samples.${+new Date}.${labels.length}.bin`;
    a.click();
    window.URL.revokeObjectURL(url);
}

export default class RecordingScreen extends GameScreen<RecordingScreenOptions, RecordingShip> {
    protected levelLength: number = ~~(DEFAULT_LEVEL_LENGTH * 5);

    protected getNextScreen(workerCommunicator: WorkerCommunicator): Screen<any> {
        const records = this.player!.records;
        console.log(`Gathered ${records.length} records`);
        const [inputMatrix, labels]: [Matrix2D, Uint8Array] = getStackedFeatures(records);
        store(inputMatrix, labels);
        workerCommunicator.startSupervisedLearning(inputMatrix, labels);
        return new SupervisedLearningScreen({
            neuralNetwork: null,
            generation: 0
        });
    }

    protected createPlayer(keyboard: Keyboard): RecordingShip {
        return new RecordingShip(keyboard);
    }
}
