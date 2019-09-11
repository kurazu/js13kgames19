import { Toolbox } from '../game/toolbox';
import { Matrix2D } from '../math/multiply';
import Screen from './screen';
import GameScreen from './game_screen';
import RecordingShip from '../ships/recording_ship';
import SupervisedLearningScreen from './supervised_screen';
import { getStackedFeatures } from '../learning/features';
import { DEFAULT_LEVEL_LENGTH, RECORDING_TARGET_TIME } from '../constants';
import { emphasis as E, TextFormatter } from './text';

function store(inputMatrix: Matrix2D, labels: Uint8Array) {
    const blob = new Blob([inputMatrix.buffer.buffer, labels.buffer], {type: 'application/octet-stream'});
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.style.display = 'none';
    a.href = url;
    a.download = `samples.${+new Date}.${labels.length}.bin`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}

export default class RecordingScreen extends GameScreen<void, RecordingShip> {
    protected levelLength: number = ~~(DEFAULT_LEVEL_LENGTH * 5);
    protected targetTime: number = RECORDING_TARGET_TIME;

    protected getNextScreen(toolbox: Toolbox): Screen<any> {
        const records = this.player!.records;
        console.log(`Gathered ${records.length} records`);
        const [inputMatrix, labels]: [Matrix2D, Uint8Array] = getStackedFeatures(records);
        store(inputMatrix, labels);
        toolbox.workerCommunicator.startSupervisedLearning(inputMatrix, labels);
        return new SupervisedLearningScreen({
            neuralNetwork: null,
            generation: 0
        });
    }

    protected createPlayer(toolbox: Toolbox): RecordingShip {
        return new RecordingShip(toolbox.keyboard);
    }
}
