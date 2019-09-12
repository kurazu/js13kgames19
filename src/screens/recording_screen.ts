import { Matrix2D } from '../math/multiply';
import ScreenType from './screen_type';
import GameScreen from './game_screen';
import RecordingShip from '../ships/recording_ship';
import { getStackedFeatures } from '../learning/features';
import { DEFAULT_LEVEL_LENGTH, RECORDING_TARGET_TIME } from '../constants';

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

export default class RecordingScreen extends GameScreen<RecordingShip> {
    protected levelLength: number = ~~(DEFAULT_LEVEL_LENGTH * 0.2);
    protected targetTime: number = RECORDING_TARGET_TIME;

    protected onLevelFinished(): ScreenType {
        if (this.isTimeLimitExceeded()) {
            return ScreenType.TIME_LIMIT_EXCEEDED;
        }
        const { player: { records }, toolbox: { workerCommunicator } } = this;
        console.log(`Gathered ${records.length} records`);
        const [inputMatrix, labels]: [Matrix2D, Uint8Array] = getStackedFeatures(records);
        store(inputMatrix, labels);
        workerCommunicator.startSupervisedLearning(inputMatrix, labels);
        return ScreenType.SUPERVISED;
    }

    protected createPlayer(): RecordingShip {
        return new RecordingShip(this.toolbox.keyboard);
    }
}
