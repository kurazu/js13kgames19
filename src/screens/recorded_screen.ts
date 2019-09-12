import { normal as N, standout as S, formatTime, Page } from './text';
import TextScreen from './text_screen';
import ScreenType from './screen_type';
import { RECORDING_TARGET_TIME, TARGET_AIRMILES } from '../constants';

const page1: Page = [
    [N("Great job! You're "), S('HIRED'), N('!')],
];

const page2: Page = [
    [N('Now gather '), S(String(TARGET_AIRMILES)), N(' air miles')],
    [N('to receive your '), S('weekly bonus'), N('!')]
];

export default class RecordedScreen extends TextScreen {
    protected getPages(): Page[] {
        return [page1, page2];
    }

    protected onDone(): ScreenType {
        return ScreenType.WAITING;
    }
}



