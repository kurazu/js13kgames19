export function range(n: number): Iterable<number> {
    return [...Array(n).keys()];
}
