import { Toolbox } from '../game/toolbox';
import BackgroundScreen from './background_screen';
import ScreenType from './screen_type';
import { Key } from '../game/keyboard';
import { WIDTH } from '../constants';
import { normal as N, emphasis as E, standout as S, inactive as I, transparent as T, TextFormatter } from './text';


export type ItemCallback = () => (ScreenType | undefined);
export type ItemType = [string, boolean, ItemCallback];

export default abstract class MenuScreen extends BackgroundScreen {
    private selectedIdx: number;
    protected items: ItemType[];

    public constructor(toolbox: Toolbox) {
        super(toolbox);
        this.items = this.getItems();
        this.selectedIdx = this.findFirstActiveItemIndex();
    }

    protected refreshOptions(): void {
        this.items = this.getItems();
        this.selectedIdx = this.findFirstActiveItemIndex();
    }

    protected findFirstActiveItemIndex(): number {
        return this.items.findIndex(([, active, ]) => active);
    }

    protected abstract getItems(): ItemType[];

    protected update(): ScreenType | undefined {
        const { toolbox: { keyboard } } = this;
        if (keyboard.wasPressed(Key.RIGHT)) {
            const [,, callback] = this.items[this.selectedIdx];
            return callback();
        } else if (keyboard.wasPressed(Key.UP)) {
            let isActive: boolean;
            do {
                this.selectedIdx--;
                if (this.selectedIdx < 0) {
                    this.selectedIdx = this.items.length - 1;
                }
                [, isActive, ] = this.items[this.selectedIdx];
            } while (!isActive);
        } else if (keyboard.wasPressed(Key.DOWN)) {
            let isActive: boolean;
            do {
                this.selectedIdx = (this.selectedIdx + 1) % this.items.length;
                [, isActive, ] = this.items[this.selectedIdx];
            } while (!isActive);
        }
        return undefined;
    }

    protected renderItems(fontSize: number, padding: number, y: number): void {
        const x = WIDTH / 2;
        for (const [idx, [text, active, ]] of this.items.entries()) {
            const isSelected = idx === this.selectedIdx;
            const textFormatter: TextFormatter =  isSelected ? E : (active ? N : I);
            const itemY = y + idx * (fontSize + padding);
            const arrowFormatter: TextFormatter = isSelected ? S : T;
            const texts: [string, string][] = [textFormatter(text), arrowFormatter(' ➜')];
            this.drawColoredText(texts, fontSize, x, itemY);
        }
    }

    protected renderHelp(fontSize: number, y: number): void {
        const x = WIDTH / 2;
        const firstLine: [string, string][] = [
            N('USE '), S('ARROW UP '), N('AND '), S('ARROW DOWN '), N('TO CHANGE OPTION.')
        ];
        this.drawColoredText(firstLine, fontSize, x, y);
        const secondLine: [string, string][] = [
            N('USE '), S('ARROW RIGHT '), N('TO SELECT.')
        ];
        this.drawColoredText(secondLine, fontSize, x, y + fontSize + 10);
    }
}
