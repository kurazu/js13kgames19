import Body from './body';
import { BLOCK_SIZE } from './constants';
import Vector from './vector';

const SHIP_SIZE = new Vector(BLOCK_SIZE * 2, BLOCK_SIZE);

export default class PlayerShip extends Body {
    constructor(position, keyboard) {
        super(position, SHIP_SIZE);
        this.keyboard = keyboard;
    }

    getControls() {
        return {
            right: this.keyboard.isPressed('ArrowRight'),
            left: this.keyboard.isPressed('ArrowLeft'),
            up: this.keyboard.isPressed('ArrowUp'),
        }
    }
}
