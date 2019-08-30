export function range(n: number): Iterable<number> {
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
