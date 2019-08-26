export default class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y= y;
    }

    add(other) {
        return new Vector(this.x + other.x, this.y + other.y);
    }

    addInplace(other) {
        this.x += other.x;
        this.y += other.y;
    }

    subtract(other) {
        return new Vector(this.x - other.x, this.y - other.y);
    }

    multitplyByScalar(factor) {
        return new Vector(this.x * factor, this.y * factor);
    }
}
