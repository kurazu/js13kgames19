import Box from './box';
import Vector from './vector';

export default class Body extends Box {
    public velocity: Vector;
    public constructor(position: Vector, size: Vector) {
        super(position, size);
        this.velocity = new Vector();
    }
}

