import { uniformRandom, range } from '../src/utils';

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
