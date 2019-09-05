import Vector from './vector';

export default class Box {
    public position: Vector;
    public readonly size: Vector;
    public constructor(position: Vector, size: Vector) {
        this.position = position;
        this.size = size;
    }

    public get halfSize(): Vector {
        return this.size.multiplyByScalar(0.5);
    }

    public get halfWidth(): number {
        return this.halfSize.x;
    }

    public get halfHeight(): number {
        return this.halfSize.y;
    }

    public get left(): number {
        return this.position.x - this.halfWidth;
    }

    public set left(value: number) {
        this.position.x = value + this.halfWidth;
    }

    public get right(): number {
        return this.position.x + this.halfWidth;
    }

    public set right(value: number) {
        this.position.x = value - this.halfWidth;
    }

    public get top(): number {
        return this.position.y + this.halfHeight;
    }

    public set top(value: number) {
        this.position.y = value - this.halfHeight;
    }

    public get bottom(): number {
        return this.position.y - this.halfHeight;
    }

    public set bottom(value: number) {
        this.position.y = value + this.halfHeight;
    }

    public get topLeft(): Vector {
        return new Vector(this.left, this.top);
    }

    public get topRight(): Vector {
        return new Vector(this.right, this.top);
    }

    public get bottomLeft(): Vector {
        return new Vector(this.left, this.bottom);
    }

    public get bottomRight(): Vector {
        return new Vector(this.right, this.bottom);
    }
}
