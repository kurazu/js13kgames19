import Body from '../physics/body';
import { BLOCK_SIZE } from '../constants';
import Vector from '../physics/vector';
import { Action } from '../physics/actions';
import { SensorsState } from '../physics/collision';

const SHIP_SIZE = new Vector(BLOCK_SIZE * 2, BLOCK_SIZE);

export default abstract class Ship extends Body {
    public touching: boolean = false;
    public lastAction: Action = new Action(false, false, false);

    public get isThinking(): boolean {
        return true;
    }

    public abstract get name(): string;

    public constructor() {
        super(new Vector(), SHIP_SIZE);
    }

    protected abstract queryControls(sensorState: SensorsState): Action;

    public getControls(sensorsState: SensorsState): Action {
        return this.lastAction = this.queryControls(sensorsState);
    }
}
