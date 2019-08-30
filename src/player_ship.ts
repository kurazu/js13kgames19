import Vector from './vector';
import Keyboard from './keyboard';
import Controls from './controls';
import Ship from './ship';

export default class PlayerShip extends Ship {
    private keyboard: Keyboard;

    constructor(position: Vector, keyboard: Keyboard) {
        super(position);
        this.keyboard = keyboard;
    }

    getControls(): Controls {
        return {
            right: this.keyboard.isPressed('ArrowRight'),
            left: this.keyboard.isPressed('ArrowLeft'),
            up: this.keyboard.isPressed('ArrowUp'),
        }
    }
}