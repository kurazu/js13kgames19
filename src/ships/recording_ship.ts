import { SensorsState } from '../physics/collision';
import { Action } from '../physics/actions';
import PlayerShip from './player_ship';
import Vector from '../physics/vector';

export default class RecordingShip extends PlayerShip {
    public readonly records: [SensorsState, Vector, Action][] = [];

    public getControls(sensorsState: SensorsState): Action {
        const action: Action = super.getControls(sensorsState);
        const velocity = this.velocity.clone();
        this.records.push([sensorsState, velocity, action]);
        return action;
    }
}
