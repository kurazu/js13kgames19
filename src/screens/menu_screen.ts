import { Toolbox } from '../game/toolbox';
import BackgroundScreen from './background_screen';
import Screen from './screen';
import { Key } from '../game/keyboard';
import { WIDTH } from '../constants';

export type ItemCallback = (toolbox: Toolbox) => (Screen<any> | undefined);

export default abstract class MenuScreen<Options> extends BackgroundScreen<Options> {
    private selectedIdx: number = 0;
    protected items: [string, boolean, ItemCallback][] = [];

    public init(toolbox: Toolbox): void {
        this.items = this.getItems(toolbox);
        this.selectedIdx = this.items.findIndex(([, active, ]) => active);
    }

    protected abstract getItems(toolbox: Toolbox): [string, boolean, ItemCallback][];

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
            const color = isSelected ? 'red' : (active ? 'white' : 'grey');
            const itemY = y + idx * (fontSize + padding);
            const arrowColor = isSelected ? 'orange' : 'transparent';
            const texts: [string, string][] = [[text, color], [' ➜', arrowColor]];
            this.drawColoredText(toolbox, texts, fontSize, x, itemY);
        }
    }

    protected renderHelp(toolbox: Toolbox, fontSize: number, y: number): void {
        const x = WIDTH / 2;
        const firstLine: [string, string][] = [
            ['USE ', 'white'],
            ['ARROW UP ', 'orange'],
            ['AND ', 'white'],
            ['ARROW DOWN ', 'orange'],
            ['TO CHANGE OPTION.', 'white']
        ];
        this.drawColoredText(toolbox, firstLine, fontSize, x, y);
        const secondLine: [string, string][] = [
            ['USE ', 'white'],
            ['ARROW RIGHT ', 'orange'],
            ['TO SELECT.', 'orange']
        ];
        this.drawColoredText(toolbox, secondLine, fontSize, x, y + fontSize + 10);
    }
}
