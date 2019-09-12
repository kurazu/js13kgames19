import { normal as N, emphasis as E, formatTime, Page } from './text';
import TextScreen from './text_screen';
import ScreenType from './screen_type';
import { RECORDING_TARGET_TIME } from '../constants';

const page1: Page = [
    [N('So '), E('ROOKIE '), N('...')],
    [N('You want to work for the')],
    [E('METRO PACKAGE SERVICE'), N('?')],
];
const page2: Page = [
    [E('Before '), N('you can get this job,')],
    [N('you need to '), E('prove '), N('your '), E('efficiency ')],
    [N('with one of our '), E('hoverloaders'), N('.')]
];
const page3: Page = [
    [N('Finish a delivery round under '), ...formatTime(RECORDING_TARGET_TIME, E), N('!')]
];

export default class IntroScreen extends TextScreen {
    protected getPages(): Page[] {
        return [page1, page2, page3];
    }

    protected onDone(): ScreenType {
        return ScreenType.RECORDING;
    }
}
