import { Toolbox } from '../game/toolbox';
import { WIDTH, HEIGHT, FPS } from '../constants';
import Keyboard from '../game/keyboard';
import WorkerCommunicator from '../worker_communication';
import Screen from './screen';
import BackgroundScreen from './background_screen';
import RecordingScreen from './recording_screen';

const FONT_SIZE_PX = 64;
const SECONDS_OF_ANIMATION = 3;
const FRAMES_OF_ANIMATION = SECONDS_OF_ANIMATION * FPS;

export default class TitleScreen extends BackgroundScreen<void> {
    private wasPressedFrame: number = 0;

    public init(toolbox: Toolbox): void {

    }

    public update(toolbox: Toolbox): Screen<any> | undefined {
        this.render(toolbox);
        if (this.wasPressedFrame) {
            if ( this.frames > this.wasPressedFrame + FRAMES_OF_ANIMATION) {
                return new RecordingScreen();
            }
        } else if (toolbox.keyboard.isAnyPressed()) {
            this.wasPressedFrame = this.frames;
        }
        return undefined;
    }

    private render(toolbox: Toolbox): void {
        const centerY = HEIGHT / 2 + FONT_SIZE_PX / 2;
        const textPeriod = FPS * 2;
        const yOffset = Math.sin(Math.PI * 2 * this.frames / textPeriod) * 10;
        this.clear(toolbox);
        const frameOfAnimation: number = this.wasPressedFrame ? this.frames - this.wasPressedFrame : 0;
        this.drawBackground(toolbox, this.frames * (10 + frameOfAnimation / FRAMES_OF_ANIMATION * 30));
        this.drawColoredText(
            toolbox, [['THE ', 'white'], ['BACK', 'red'], ['-UP', 'white']],
            FONT_SIZE_PX, WIDTH / 2, centerY + yOffset
        );
        this.drawColoredText(
            toolbox, [['by ', 'white'], ['kurazu', 'red']],
            FONT_SIZE_PX / 2, WIDTH / 2, centerY + yOffset + 50
        );
        if (!this.wasPressedFrame) {
            if ((~~(this.frames / FPS * 2)) % 2) {
                this.drawColoredText(
                    toolbox, [['PRESS ANY ', 'white'], ['ARROW', 'red'], [' TO START', 'white']],
                    FONT_SIZE_PX / 2, WIDTH / 2, HEIGHT - 50
                );
            }
        }
    }
}





