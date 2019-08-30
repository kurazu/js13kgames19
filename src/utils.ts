export function range(n: number): Iterable<number> {
    return [...Array(n).keys()];
}

export function randRange(n: number): number {
    return ~~(Math.random() * n);
}

