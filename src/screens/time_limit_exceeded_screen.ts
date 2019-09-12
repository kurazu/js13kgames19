import { normal as N, standout as S, formatTime, Page } from './text';
import TextScreen from './text_screen';
import ScreenType from './screen_type';
import { RECORDING_TARGET_TIME } from '../constants';

const page1: Page = [
    [N('Not bad, but you can do better.')],
    [N('I cannot give you this job')],
    [N('unless you can fly under '), ...formatTime(RECORDING_TARGET_TIME, S), N('.')]
];

const page2: Page = [
    [N('Try again.')],
    [N('This time give it '), S('all you got'), N('!')]
];

export default class TimeLimitExceededScreen extends TextScreen {
    protected getPages(): Page[] {
        return [page1, page2];
    }

    protected onDone(): ScreenType {
        return ScreenType.RECORDING;
    }
}
