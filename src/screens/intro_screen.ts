import { normal as N, standout as S, formatTime, Page } from './text';
import TextScreen from './text_screen';
import ScreenType from './screen_type';
import { RECORDING_TARGET_TIME } from '../constants';

const page1: Page = [
    [N('So '), S('ROOKIE '), N('...')],
    [N('You want to work for the')],
    [S('METRO PACKAGE SERVICE'), N('?')],
];
const page2: Page = [
    [S('Before '), N('you can get this job,')],
    [N('you need to '), S('prove '), N('your '), S('efficiency ')],
    [N('with one of our '), S('hoverloaders'), N('.')]
];
const page3: Page = [
    [N('Finish a delivery round under '), ...formatTime(RECORDING_TARGET_TIME, S), N('!')]
];

export default class IntroScreen extends TextScreen {
    protected getPages(): Page[] {
        return [page1, page2, page3];
    }

    protected onDone(): ScreenType {
        return ScreenType.RECORDING;
    }
}
