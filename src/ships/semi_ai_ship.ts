import { SensorsState } from '../physics/collision';
import AIShip from './ai_ship';
import {} from '../physics/actions';
import { Queue } from '../math/queue';
import { Action, ACTIONS, Actions } from '../physics/actions';
import { FPS } from '../constants';

const NO_PROGRESS_DURATION = FPS * 15;
const BACKOFF_DURATION = FPS * 1.5;

export default class SemiAIShip extends AIShip {
    private bestX: number = 0;
    private progressQueue: Queue<number> = new Queue(NO_PROGRESS_DURATION);
    private backoffCounter: number = 0;

    public queryControls(sensorsState: SensorsState): Action {
        const intelligentAction = super.queryControls(sensorsState);
        const currentX = this.position.x;
        const currentProgress = Math.max(this.bestX, currentX);
        this.progressQueue.push(currentProgress);

        if (this.backoffCounter) {
            this.backoffCounter--;
            if (!this.backoffCounter) {
                this.progressQueue = new Queue(NO_PROGRESS_DURATION);
                this.bestX = currentX;
            }
            return ACTIONS[Actions.LEFT];
        } else if (this.progressQueue.isFull() && currentProgress - this.progressQueue[0] <= 0) {
            this.backoffCounter = BACKOFF_DURATION;
            return ACTIONS[Actions.LEFT];
        } else {
            return intelligentAction;
        }
    }

    public get isThinking(): boolean {
        return !this.backoffCounter;
    }

}
