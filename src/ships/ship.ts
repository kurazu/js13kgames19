import Body from '../physics/body';
import { BLOCK_SIZE } from '../constants';
import Vector from '../physics/vector';
import { Action } from '../physics/actions';
import { SensorsState } from '../physics/collision';

const SHIP_SIZE = new Vector(BLOCK_SIZE * 2, BLOCK_SIZE);

export default abstract class Ship extends Body {
    public touching: boolean = false;

    public constructor() {
        super(new Vector(), SHIP_SIZE);
    }

    public abstract getControls(sensorsState: SensorsState): Action;
}
