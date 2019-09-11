import MenuScreen, { ItemType } from './menu_screen';
import { Toolbox } from '../game/toolbox';
import Screen from './screen';
import { WIDTH, HEIGHT } from '../constants';

interface TextScreenOptions {
    page: number
}

type Line = [string, string][];
export type Page = Line[];

const FONT_SIZE_PX: number = 32;

export default abstract class TextScreen extends MenuScreen<TextScreenOptions> {
    protected pages: Page[] = [];

    protected getItems(toolbox: Toolbox): ItemType[] {
        const isLastPage = this.options.page === this.pages.length - 1;
        const isFirstPage = this.options.page === 0;
        return [
            ['NEXT', !isLastPage, this.onNext.bind(this)],
            ['DONE', true, this.onDone.bind(this)],
            ['PREVIOUS', !isFirstPage, this.onPrevious.bind(this)],
        ];
    }

    protected onNext(toolbox: Toolbox): Screen<any> | undefined {
        this.options.page++;
        this.refreshOptions(toolbox);
        return undefined;
    }

    protected onPrevious(toolbox: Toolbox): Screen<any> | undefined {
        this.options.page--;
        this.refreshOptions(toolbox);
        return undefined;
    }

    protected abstract onDone(toolbox: Toolbox): Screen<any> | undefined;

    protected abstract getPages(toolbox: Toolbox): Page[];

    public init(toolbox: Toolbox): void {
        this.pages = this.getPages(toolbox);
        super.init(toolbox);
    }

    public update(toolbox: Toolbox): Screen<any> | undefined {
        const nextScreen = super.update(toolbox);
        this.render(toolbox);
        return nextScreen;
    }

    protected render(toolbox: Toolbox) {
        this.clear(toolbox);
        this.drawBackground(toolbox, this.frames * 10);
        const page = this.pages[this.options.page];
        const padding = 10;
        for (const [idx, line] of page.entries()) {
            this.drawColoredText(toolbox, line, FONT_SIZE_PX, WIDTH / 2, (idx + 2) * (FONT_SIZE_PX + padding));
        }

        this.renderItems(toolbox, ~~(FONT_SIZE_PX) / 2, 10, HEIGHT - 150);
        this.renderHelp(toolbox, ~~(FONT_SIZE_PX / 2), HEIGHT - 50);
    }
}
