import Vector from './vector';
import Keyboard from './keyboard';
import { Action } from './actions';
import Ship from './ship';
import { SensorsState } from './collision';

export default class RandomShip extends Ship {
    private counter: number = 0;

    public getControls(sensorsState: SensorsState): Action {
        const second = ~~(this.counter++ / 60);
        const phase = second % 4;
        const right = phase <= 1;
        const left = phase === 2;
        const up = phase === 3;
        return new Action(up, left, right);
    }
}
