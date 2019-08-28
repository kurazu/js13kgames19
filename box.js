import Vector from './vector';

export default class Box {
    constructor(position, size) {
        this.position = position;
        this.size = size;
    }

    get halfSize() {
        return this.size.multiplyByScalar(0.5);
    }

    get halfWidth() {
        return this.halfSize.x;
    }

    get halfHeight() {
        return this.halfSize.y;
    }

    get left() {
        return this.position.x - this.halfWidth;
    }

    set left(value) {
        this.position.x = value + this.halfWidth;
    }

    get right() {
        return this.position.x + this.halfWidth;
    }

    set right(value) {
        this.position.x = value - this.halfWidth;
    }

    get top() {
        return this.position.y + this.halfHeight;
    }

    set top(value) {
        this.position.y = value - this.halfHeight;
    }

    get bottom() {
        return this.position.y - this.halfHeight;
    }

    set bottom(value) {
        this.position.y = value + this.halfHeight;
    }

    get topLeft() {
        return new Vector(this.left, this.top);
    }

    get topRight() {
        return new Vector(this.right, this.top);
    }

    get bottomLeft () {
        return new Vector(this.left, this.bottom);
    }

    get bottomRight () {
        return new Vector(this.right, this.bottom);
    }
}
