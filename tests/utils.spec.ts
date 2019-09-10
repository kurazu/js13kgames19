import { uniformRandom, range } from '../src/utils';

describe('range', () => {
    const testData: [number, number[]][] = [
        [0, []],
        [1, [0]],
        [2, [0, 1]],
        [3, [0, 1, 2]],
        [4, [0, 1, 2, 3]],
        [5, [0, 1, 2, 3, 4]]
    ];
    for (const [n, expected] of testData) {
        test(`generates a sequence for n=${n}`, () => {
            expect(range(n)).toEqual(expected);
        });
    }
});

describe('uniformRandom', () => {
    test('generates range <-1, 1>', () => {
        const results = range(1000).map(uniformRandom);
        const signs: Map<number, boolean> = new Map();
        for (const r of results) {
            signs.set(Math.sign(r), true);
            expect(r).toBeGreaterThanOrEqual(-1);
            expect(r).toBeLessThanOrEqual(1);
        }
        expect(signs.get(-1)).toBe(true);
        expect(signs.get(+1)).toBe(true);
    });
});
