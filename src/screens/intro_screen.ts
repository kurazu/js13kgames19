import { normal as N, emphasis as E, formatTime } from './text';
import { Toolbox } from '../game/toolbox';
import TextScreen, { Page } from './text_screen';
import RecordingScreen from './recording_screen';
import Screen from './screen';
import { RECORDING_TARGET_TIME } from '../constants';

export default class IntroScreen extends TextScreen {
    protected getPages(toolbox: Toolbox): Page[] {
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
        return [page1, page2, page3];
    }

    protected onDone(toolbox: Toolbox): Screen<any> | undefined {
        return new RecordingScreen();
    }
}
