export default class Vector {
    public x: number;
    public y: number;

    public constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    [Symbol.iterator]() {
        return [this.x, this.y][Symbol.iterator]()
    }

    public add(other: Vector): Vector {
        return new Vector(this.x + other.x, this.y + other.y);
    }

    public addInplace(other: Vector): void {
        this.x += other.x;
        this.y += other.y;
    }

    public subtract(other: Vector): Vector {
        return new Vector(this.x - other.x, this.y - other.y);
    }

    public multiplyByScalar(factor: number): Vector {
        return new Vector(this.x * factor, this.y * factor);
    }

    public multiplyByScalarInplace(factor: number): void {
        this.x *= factor;
        this.y *= factor;
    }

    public multiply(other: Vector): Vector {
        return new Vector(this.x * other.x, this.y * other.y);
    }

    public static add(vectors: Iterable<Vector>): Vector {
        const result = new Vector();
        for (const vector of vectors) {
            result.addInplace(vector);
        }
        return result;
    }

    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public trim (maxLength: number): void {
        const length = this.length();
        if (length > maxLength) {
            const factor = maxLength / length;
            this.multiplyByScalarInplace(factor);
        }
    }

    public clone(): Vector {
        return new Vector(this.x, this.y);
    }
}

