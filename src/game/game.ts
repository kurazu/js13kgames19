import Screen from '../screens/screen';
import ScreenType from '../screens/screen_type';
import { Toolbox, loadToolbox } from './toolbox';
import TitleScreen from '../screens/title_screen';
import IntroScreen from '../screens/intro_screen';
import RecordingScreen from '../screens/recording_screen';
import TimeLimitExceededScreen from '../screens/time_limit_exceeded_screen';
import RecordedScreen from '../screens/recorded_screen';
import WaitingScreen from '../screens/waiting_screen';
import CompeteScreen from '../screens/compete_screen';
import TrainedScreen from '../screens/trained_screen';

type ScreenClass = {new(toolbox: Toolbox): Screen};

const screenConstructors: Map<ScreenType, ScreenClass> = new Map();
screenConstructors.set(ScreenType.TITLE, TitleScreen);
screenConstructors.set(ScreenType.INTRO, IntroScreen);
screenConstructors.set(ScreenType.RECORDING, RecordingScreen);
screenConstructors.set(ScreenType.TIME_LIMIT_EXCEEDED, TimeLimitExceededScreen);
screenConstructors.set(ScreenType.RECORDED, RecordedScreen);
screenConstructors.set(ScreenType.WAITING, WaitingScreen);
screenConstructors.set(ScreenType.COMPETE, CompeteScreen);
screenConstructors.set(ScreenType.TRAINED, TrainedScreen);

export default async function start(canvas: HTMLCanvasElement, initialScreenType: ScreenType): Promise<void> {
    const toolbox: Toolbox = await loadToolbox(canvas);
    let screen: Screen = loadScreen(initialScreenType);

    requestAnimationFrame(loop);

    function loop(): void {
        const nextScreenType: ScreenType | undefined = screen.loop();
        if (nextScreenType !== undefined) {
            screen = loadScreen(nextScreenType);
        }
        requestAnimationFrame(loop);
    }

    function loadScreen(screenType: ScreenType): Screen {
        const constructor = screenConstructors.get(screenType)!;
        return new constructor(toolbox);
    }
}
