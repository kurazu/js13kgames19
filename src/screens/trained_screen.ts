import { normal as N, standout as S, formatTime, Page } from './text';
import TextScreen from './text_screen';
import ScreenType from './screen_type';
import { RECORDING_TARGET_TIME } from '../constants';

const page1: Page = [
    [N('Do you remember your timed test drive, '), S('ROOKIE'), N('?')],
    [N('We recorded it.')],
];
const page2: Page = [
    [N('Have you ever heard about '), S('Artifical Intelligence'), N('?')],
    [N('While you were working hard for your '), S('bonus')],
    [N('we trained a '), S('neural network '), ],
    [N('to replicate your driving patterns')],
    [N('from that test drive.')]
];
const page3: Page = [
    [N('Then we let an '), S('unsupervised genetic algorithm')],
    [N('improve on those skills '), S('beyond '), N('your level. ')]
];
const page4: Page = [
    [N('Now we have an '), S('autonomic driving algorithm ')],
    [N('for the other hoverloader.')],
    [N('We are going to keep you for now,')],
    [N('while we evaluate the '), S('AI'), N('.')],
];
const page5: Page = [
    [N('But once it bests you, you\'re '), S('OUT'), N('!')],
];

export default class TrainedScreen extends TextScreen {
    protected getPages(): Page[] {
        return [page1, page2, page3, page4, page5];
    }

    protected onDone(): ScreenType {
        return ScreenType.COMPETE;
    }
}

