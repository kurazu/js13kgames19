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

    multiplyByScalar(factor) {
        return new Vector(this.x * factor, this.y * factor);
    }

    muliplyByScalarInplace(factor) {
        this.x *= factor;
        this.y *= factor;
    }

    static add(vectors) {
        const result = new Vector();
        for (const vector of vectors) {
            result.addInplace(vector);
        }
        return result;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    trim (maxLength) {
        const length = this.length();
        if (length > maxLength) {
            const factor = maxLength / length;
            this.muliplyByScalarInplace(factor);
        }
    }
}

