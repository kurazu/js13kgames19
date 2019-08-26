import Vector from './vector';

export default class Box extends Vector {
    constructor(x, y, width, height) {
        super(x, y);
        this.width = width;
        this.height = height;
    }

    get halfWidth () {
        return this.width / 2;
    }

    get halfHeight () {
        return this.height / 2;
    }

    get left () {
        return this.x - this.halfWidth;
    }

    get right () {
        return this.x + this.halfWidth;
    }

    get top () {
        return this.y + this.halfHeight;
    }

    get bottom() {
        return this.y - this.halfHeight;
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

    contains (vector) {
        return (this.left <= vector.x && vector.x <= this.right) && (this.bottom <= vector.y && vector.y <= this.top);
    }
}
