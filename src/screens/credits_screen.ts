import { normal as N, standout as S, emphasis as E, formatTime, Page } from './text';
import TextScreen from './text_screen';
import ScreenType from './screen_type';

const page1: Page = [
    [N('THE '), E('BACK'), N('-UP OF '), E('YOU')],
    [],
    [N('by '), S('kurazu')],
    [S('Tomasz Maćkowiak')],
    [N('kurazu@kurazu.net')],
    [N('GitHub: '), S('https://github.com/kurazu/js13kgames19')],
    [],
    [N('Special thanks to my '), S('beloved wife ')],
    [N('who survived a month of furious game development.')]
];

export default class CreditsScreen extends TextScreen {
    protected getPages(): Page[] {
        return [page1];
    }

    protected onDone(): ScreenType {
        return ScreenType.TITLE;
    }
}

