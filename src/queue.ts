import { assert } from './utils';
// export default class Queue<T> extends Array<T> {
//     private maxLength: number;

//     public constructor(maxLength: number) {
//         super();
//         this.maxLength = maxLength;
//     }

//     public push(...items: T[]): number {
//         while (this.length + items.length > this.maxLength) {
//             this.shift();
//         }
//         return super.push(...items);
//     }
// }

export default class FeaturesQueue {
    public readonly array: Float32Array;
    private inputWidth: number;
    private maxLength: number;
    private initialized: boolean = false;

    public constructor(inputWidth: number, maxLength: number) {
        this.inputWidth = inputWidth;
        this.maxLength = maxLength;
        this.array = new Float32Array(inputWidth * maxLength);
    }

    public push(features: Float32Array) {
        assert(features.length === this.inputWidth);
        if (!this.initialized) {
            for (let i = 0; i < this.maxLength; i++) {
                this.array.set(features, i * this.inputWidth);
            }
            this.initialized = true;
        } else {
            this.array.copyWithin(0, this.inputWidth);
            this.array.set(features, this.array.length - this.inputWidth);
        }
    }
}
