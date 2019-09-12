import MenuScreen, { ItemType } from './menu_screen';
import { Toolbox } from '../game/toolbox';
import ScreenType from './screen_type';
import { WIDTH, HEIGHT } from '../constants';
import { Line, Page } from './text';

const FONT_SIZE_PX: number = 32;

export default abstract class TextScreen extends MenuScreen {
    protected pages: Page[];
    protected page: number = 0;

    public constructor(toolbox: Toolbox) {
        super(toolbox);
        this.pages = this.getPages();
    }

    protected getItems(): ItemType[] {
        const pages = this.getPages();
        const isLastPage = this.page === pages.length - 1;
        const isFirstPage = this.page === 0;
        return [
            ['NEXT', !isLastPage, this.onNext.bind(this)],
            ['DONE', true, this.onDone.bind(this)],
            ['PREVIOUS', !isFirstPage, this.onPrevious.bind(this)],
        ];
    }

    protected onNext(): ScreenType | undefined {
        this.page++;
        this.refreshOptions();
        return undefined;
    }

    protected onPrevious(): ScreenType | undefined {
        this.page--;
        this.refreshOptions();
        return undefined;
    }

    protected abstract onDone(): ScreenType;
    protected abstract getPages(): Page[];

    protected update(): ScreenType | undefined {
        const nextScreen = super.update();
        this.render();
        return nextScreen;
    }

    protected render() {
        this.clear();
        this.drawBackground(this.frames * 10);
        const page = this.pages[this.page];
        const padding = 10;
        this.drawColoredTexts(page, FONT_SIZE_PX, padding, WIDTH / 2, FONT_SIZE_PX + padding);
        this.renderItems(~~(FONT_SIZE_PX) / 2, 10, HEIGHT - 150);
        this.renderHelp(~~(FONT_SIZE_PX / 2), HEIGHT - 50);
    }
}
