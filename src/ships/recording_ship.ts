import { SensorsState } from '../physics/collision';
import { Action } from '../physics/actions';
import PlayerShip from './player_ship';

export default class RecordingShip extends PlayerShip {
    public readonly records: [SensorsState, Action][] = [];

    public getControls(sensorsState: SensorsState): Action {
        const action: Action = super.getControls(sensorsState);
        this.records.push([sensorsState, action]);
        return action;
    }
}
