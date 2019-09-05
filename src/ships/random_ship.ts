import Body from '../physics/body';
import { BLOCK_SIZE } from '../constants';
import Vector from '../physics/vector';
import { Action } from '../physics/actions';
import { SensorsState } from '../physics/collision';
import Ship from './ship';

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
