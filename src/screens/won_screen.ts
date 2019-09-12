import { normal as N, standout as S, formatTime, Page } from './text';
import TextScreen from './text_screen';
import ScreenType from './screen_type';
import { RECORDING_TARGET_TIME } from '../constants';

const page1: Page = [
    [N('WON')],
];

export default class WonScreen extends TextScreen {
    protected getPages(): Page[] {
        return [page1];
    }

    protected onDone(): ScreenType {
        return ScreenType.COMPETE;
    }
}

