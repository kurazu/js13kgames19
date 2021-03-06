export class Queue<T> extends Array<T> {
    public readonly maxLength: number;

    public constructor(maxLength: number) {
        super();
        this.maxLength = maxLength;
    }

    public isFull(): boolean {
        return this.length === this.maxLength;
    }

    public push(...items: T[]): number {
        while (this.length + items.length > this.maxLength) {
            this.shift();
        }
        return super.push(...items);
    }
}

export class FeaturesQueue {
    public readonly array: Float32Array;
    private inputWidth: number;
    private maxLength: number;
    private initialized: boolean = false;
    private length: number = 0;

    public constructor(inputWidth: number, maxLength: number) {
        this.inputWidth = inputWidth;
        this.maxLength = maxLength;
        this.array = new Float32Array(inputWidth * maxLength);
    }

    public push(features: Float32Array) {
        if (!this.initialized) {
            for (let i = 0; i < this.maxLength; i++) {
                this.array.set(features, i * this.inputWidth);
            }
            this.initialized = true;
        } else {
            this.array.copyWithin(0, this.inputWidth);
            this.array.set(features, this.array.length - this.inputWidth);
        }
        this.length = Math.max(this.length + 1, this.maxLength);
    }

    public isFull(): boolean {
        return this.length === this.maxLength;
    }
}
