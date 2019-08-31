import Vector from './vector';
import Keyboard from './keyboard';
import Controls from './controls';
import Ship from './ship';
import { SensorsState } from './collision';

export default class PlayerShip extends Ship {
    private keyboard: Keyboard;

    public constructor(position: Vector, keyboard: Keyboard) {
        super(position);
        this.keyboard = keyboard;
    }

    public getControls(sensorsState: SensorsState): Controls {
        return {
            right: this.keyboard.isPressed('ArrowRight'),
            left: this.keyboard.isPressed('ArrowLeft'),
            up: this.keyboard.isPressed('ArrowUp'),
        }
    }
}
