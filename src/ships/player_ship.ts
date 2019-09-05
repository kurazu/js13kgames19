import Vector from '../physics/vector';
import Keyboard from '../game/keyboard';
import { Action } from '../physics/actions';
import Ship from './ship';
import { SensorsState } from '../physics/collision';

export default class PlayerShip extends Ship {
    private keyboard: Keyboard;

    public constructor(keyboard: Keyboard) {
        super();
        this.keyboard = keyboard;
    }

    public getControls(sensorsState: SensorsState): Action {
        const right = this.keyboard.isPressed('ArrowRight');
        const left = this.keyboard.isPressed('ArrowLeft');
        const up = this.keyboard.isPressed('ArrowUp');
        return new Action(up, left, right);
    }
}
