import Vector from './vector';
import Keyboard from './keyboard';
import Controls from './controls';
import Ship from './ship';

export default class RandomShip extends Ship {
    private counter: number = 0;

    public getControls(): Controls {
        const second = ~~(this.counter++ / 60);
        const phase = second % 4;
        return {
            right: phase <= 1,
            left: phase === 2,
            up: phase === 3,
        }
    }
}
