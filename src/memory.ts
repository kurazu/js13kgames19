export class Pointer {
    private readonly dataView: Float32Array;
    public readonly offset: number;
    public readonly size: number;

    public constructor(dataView: Float32Array, offset: number, size: number) {
        this.dataView = dataView;
        this.offset = offset;
        this.size = size;
    }

    public get array(): Float32Array {
        return this.dataView.subarray(this.offset, this.offset + this.size);
    }
}

export default class MemoryManager {
    private memory: WebAssembly.Memory;
    private dataView: Float32Array;
    private allocations: Uint8Array;
    private lastMallocIndex: number = 0;
    private managedObjects: Map<Float32Array, number>;

    constructor(size: number) {
        this.memory = new WebAssembly.Memory({initial: size, maximum: size});
        this.dataView = new Float32Array(this.memory.buffer);
        this.allocations = new Uint8Array(this.dataView.length);
        this.managedObjects = new Map();
    }

    malloc(size: number): Float32Array {
        if (this.lastMallocIndex + size < this.dataView.length) { /* there is space at the end of memory */
            // mark area as allocated.
            this.allocations.fill(1, this.lastMallocIndex, this.lastMallocIndex + size);
            return this.dataView.subarray(this.lastMallocIndex, this.lastMallocIndex + size);
            this.lastMallocIndex += size;
        } else {
            /* there is no space at the end */
        }
        return new Float32Array(0);
    }

    free(point: Pointer): void {
        this.dataView.fill(0, point.offset, point.offset + point.size);
        this.allocations.fill(0, point.offset, point.offset + point.size);
    }
}
