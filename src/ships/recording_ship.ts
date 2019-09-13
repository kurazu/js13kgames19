import { SensorsState } from '../physics/collision';
import { Action } from '../physics/actions';
import PlayerShip from './player_ship';
import Vector from '../physics/vector';

export default class RecordingShip extends PlayerShip {
    public readonly records: [SensorsState, Vector, Vector, Action][] = [];

    public queryControls(sensorsState: SensorsState): Action {
        const action: Action = super.queryControls(sensorsState);
        const velocity = this.velocity.clone();
        const position = this.position.clone();
        this.records.push([sensorsState, velocity, position, action]);
        return action;
    }
}
