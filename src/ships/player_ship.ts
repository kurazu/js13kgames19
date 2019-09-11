import Vector from '../physics/vector';
import Keyboard, { Key } from '../game/keyboard';
import { Action } from '../physics/actions';
import Ship from './ship';
import { SensorsState } from '../physics/collision';

export default class PlayerShip extends Ship {
    private keyboard: Keyboard;

    public constructor(keyboard: Keyboard) {
        super();
        this.keyboard = keyboard;
    }

    public queryControls(sensorsState: SensorsState): Action {
        const right = this.keyboard.isPressed(Key.RIGHT);
        const left = this.keyboard.isPressed(Key.LEFT);
        const up = this.keyboard.isPressed(Key.UP);
        return new Action(up, left, right);
    }

    public get name() {
        return 'ROOKIE';
    }
}
