import Body from './body';
import { BLOCK_SIZE } from './constants';
import Vector from './vector';
import Keyboard from './keyboard';

const SHIP_SIZE = new Vector(BLOCK_SIZE * 2, BLOCK_SIZE);

export interface Controls {
    right: boolean;
    left: boolean;
    up: boolean;
}

export default class PlayerShip extends Body {
    private keyboard: Keyboard;
    public touching: boolean = false;

    constructor(position: Vector, keyboard: Keyboard) {
        super(position, SHIP_SIZE);
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
