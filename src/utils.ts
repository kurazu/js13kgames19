export function range(n: number): number[] {
    return [...Array(n).keys()];
}

export function randRange(n: number): number {
    return ~~(Math.random() * n);
}

export function minBy<T>(items: T[], measureCallback: (item: T) => number): [T, number] {
    const first = items[0];
    const firstMeasure = measureCallback(first);
    return items.slice(1).reduce(([bestItem, bestMeasure], item) => {
        const measure = measureCallback(item);
        if (measure < bestMeasure) {
            return [item, measure];
        } else {
            return [bestItem, bestMeasure];
        }
    }, [first, firstMeasure]);
}

export function assert(condition: boolean, msg: string = ''): void {
    if (!condition) {
        throw new Error(msg);
    }
}

export function zip(...sequences: any[][]) {
    const first = sequences[0];
    for (const sequence of sequences) {
        assert(sequence.length === first.length);
    }
    return first.map((_, idx) => sequences.map(sequence => sequence[idx]));
}

export function sum(sequence: number[]): number {
    return sequence.reduce((acc, item) => acc + item, 0);
}
