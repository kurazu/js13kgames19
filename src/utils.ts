export function range(n: number): number[] {
    return [...Array(n).keys()];
}

export function randRange(n: number): number {
    return ~~(Math.random() * n);
}

export function randRange2(start: number, end: number): number {
    return randRange(end + 1- start) + start;
}

export function randomSample(n: number, k: number): number[] {
    const choices = range(n);
    return range(k).map(_ => {
        const idx = randRange(choices.length);
        const [selected] = choices.splice(idx, 1);
        return selected;
    });
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

export function maxBy<T>(items: T[], measureCallback: (item: T) => number): [T, number] {
    const first = items[0];
    const firstMeasure = measureCallback(first);
    return items.slice(1).reduce(([bestItem, bestMeasure], item) => {
        const measure = measureCallback(item);
        if (measure > bestMeasure) {
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

export function assertEqual(a: any, b: any, msg: string = `${a} !== ${b}`): void {
    assert(a === b, msg);
}

export function assertDoubleRange(lowerRange: any, x: any, upperRange: any, msg: string = `${x} not in [${lowerRange};${upperRange}]`): void {
    assert(lowerRange <= x && x < upperRange);
}

export function zip(...arrays: Float32Array[]): Float32Array[] {
    const first: Float32Array = arrays[0];
    for (const array of arrays) {
        assert(array.length === first.length);
    }
    return range(first.length).map((idx: number) => Float32Array.from(arrays.map(array => array[idx])));
}

export function sum(sequence: number[]): number {
    return sequence.reduce((acc, item) => acc + item, 0);
}

export function uniformRandom(): number {
    return Math.random() * 2 - 1;
}

export function* chain<T>(...iterables: Iterable<T>[]): Iterable<T> {
    for (const iterable of iterables) {
        yield* iterable;
    }
}

export function iterableMap<Input, Output>(
    iterable: Iterable<Input>,
    mapCallback: ((input: Input) => Output)
): Output[] {
    const result: Output[] = [];
    for (const input of iterable) {
        result.push(mapCallback(input));
    }
    return result;
}


export function* everyNthReversed<T>(iterable: T[], n: number): Iterable<T> {
    assert(iterable.length > 0);
    let idx = iterable.length - 1;
    let item = iterable[idx];
    yield item;
    while (true) {
        idx -= n;
        if (iterable.hasOwnProperty(idx)) {
            item = iterable[idx];
        }
        yield item;
    }
}
