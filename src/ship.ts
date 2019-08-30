import Body from './body';
import { BLOCK_SIZE } from './constants';
import Vector from './vector';
import Controls from './controls';

const SHIP_SIZE = new Vector(BLOCK_SIZE * 2, BLOCK_SIZE);

export default abstract class Ship extends Body {
    public touching: boolean = false;

    constructor(position: Vector) {
        super(position, SHIP_SIZE);
    }

    abstract getControls() : Controls;
}
