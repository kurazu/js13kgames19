export default class Vector extends Float32Array {
    public constructor(x: number = 0, y: number = 0) {
        super(2);
        this[0] = x;
        this[1] = y;
    }

    public get x(): number {
        return this[0];
    }

    public get y(): number {
        return this[1];
    }

    public set x(value: number) {
        this[0] = value;
    }

    public set y(value: number) {
        this[1] = value;
    }

    public add(other: Vector): Vector {
        return new Vector(this[0] + other[0], this[1] + other[1]);
    }

    public addInplace(other: Vector): void {
        this[0] += other[0];
        this[1] += other[1];
    }

    public subtract(other: Vector): Vector {
        return new Vector(this[0] - other[0], this[1] - other[1]);
    }

    public multiplyByScalar(factor: number): Vector {
        return new Vector(this[0] * factor, this[1] * factor);
    }

    public multiplyByScalarInplace(factor: number): void {
        this[0] *= factor;
        this[1] *= factor;
    }

    public multiply(other: Vector): Vector {
        return new Vector(this[0] * other[0], this[1] * other[1]);
    }

    public static add(vectors: Iterable<Vector>): Vector {
        const result = new Vector();
        for (const vector of vectors) {
            result.addInplace(vector);
        }
        return result;
    }

    public getLength(): number {
        return Math.sqrt(this[0] * this[0] + this[1] * this[1]);
    }

    public trim (maxLength: number): void {
        const length = this.getLength();
        if (length > maxLength) {
            const factor = maxLength / length;
            this.multiplyByScalarInplace(factor);
        }
    }

    public clone(): Vector {
        return new Vector(this[0], this[1]);
    }

    static fromAngleAndLength(angle: number, length: number): Vector {
        const x = Math.cos(angle) * length;
        const y = Math.sin(angle) * length;
        return new Vector(x, y);
    }
}

