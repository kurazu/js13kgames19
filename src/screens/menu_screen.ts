import { Toolbox } from '../game/toolbox';
import BackgroundScreen from './background_screen';
import Screen from './screen';
import { Key } from '../game/keyboard';
import { WIDTH } from '../constants';
import { normal as N, emphasis as E, standout as S, inactive as I, transparent as T, TextFormatter } from './text';

export type ItemCallback = (toolbox: Toolbox) => (Screen<any> | undefined);
export type ItemType = [string, boolean, ItemCallback];

export default abstract class MenuScreen<Options> extends BackgroundScreen<Options> {
    private selectedIdx: number = 0;
    protected items: ItemType[] = [];

    protected refreshOptions(toolbox: Toolbox): void {
        this.items = this.getItems(toolbox);
        this.selectedIdx = this.items.findIndex(([, active, ]) => active);
    }

    public init(toolbox: Toolbox): void {
        this.refreshOptions(toolbox);
    }

    protected abstract getItems(toolbox: Toolbox): ItemType[];

    public update(toolbox: Toolbox): Screen<any> | undefined {
        if (toolbox.keyboard.wasPressed(Key.RIGHT)) {
            const [,, callback] = this.items[this.selectedIdx];
            return callback(toolbox);
        } else if (toolbox.keyboard.wasPressed(Key.UP)) {
            let isActive: boolean;
            do {
                this.selectedIdx--;
                if (this.selectedIdx < 0) {
                    this.selectedIdx = this.items.length - 1;
                }
                [, isActive, ] = this.items[this.selectedIdx];
            } while (!isActive);
        } else if (toolbox.keyboard.wasPressed(Key.DOWN)) {
            let isActive: boolean;
            do {
                this.selectedIdx = (this.selectedIdx + 1) % this.items.length;
                [, isActive, ] = this.items[this.selectedIdx];
            } while (!isActive);
        }
        return undefined;
    }

    protected renderItems(toolbox: Toolbox, fontSize: number, padding: number, y: number): void {
        const x = WIDTH / 2;
        for (const [idx, [text, active, ]] of this.items.entries()) {
            const isSelected = idx === this.selectedIdx;
            const textFormatter: TextFormatter =  isSelected ? E : (active ? N : I);
            const itemY = y + idx * (fontSize + padding);
            const arrowFormatter: TextFormatter = isSelected ? S : T;
            const texts: [string, string][] = [textFormatter(text), arrowFormatter(' ➜')];
            this.drawColoredText(toolbox, texts, fontSize, x, itemY);
        }
    }

    protected renderHelp(toolbox: Toolbox, fontSize: number, y: number): void {
        const x = WIDTH / 2;
        const firstLine: [string, string][] = [
            N('USE '), S('ARROW UP '), N('AND '), S('ARROW DOWN '), N('TO CHANGE OPTION.')
        ];
        this.drawColoredText(toolbox, firstLine, fontSize, x, y);
        const secondLine: [string, string][] = [
            N('USE '), S('ARROW RIGHT '), N('TO SELECT.')
        ];
        this.drawColoredText(toolbox, secondLine, fontSize, x, y + fontSize + 10);
    }
}
