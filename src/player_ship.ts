import Vector from './vector';
import Keyboard from './keyboard';
import { Action } from './actions';
import Ship from './ship';
import { SensorsState } from './collision';

export default class PlayerShip extends Ship {
    private keyboard: Keyboard;

    public constructor(position: Vector, keyboard: Keyboard) {
        super(position);
        this.keyboard = keyboard;
    }

    public getControls(sensorsState: SensorsState): Action {
        const right = this.keyboard.isPressed('ArrowRight');
        const left = this.keyboard.isPressed('ArrowLeft');
        const up = this.keyboard.isPressed('ArrowUp');
        return new Action(up, left, right);
    }
}
