import Box from './box';
import Vector from './vector';

export default class Body extends Box {
    constructor(...args) {
        super(...args);
        this.velocity = new Vector();
    }
}

