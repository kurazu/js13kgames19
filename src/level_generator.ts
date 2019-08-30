import { COLUMNS, ROWS } from './constants';
import { range } from './utils';

function* generateLevelStart(levelLength: number): Iterable<[number, number]> {
    for (const row of range(ROWS)) {
        yield [0, row];
    }
}

function* generateLevelContent(levelLength: number): Iterable<[number, number]> {
    for (const column of range(levelLength - 2)) {
        yield [column + 1, 0];
        yield [column + 1, ROWS - 1];
        if (Math.random() < 0.1) {
            yield [column + 1, 1];
        }
        if (Math.random() < 0.05) {
            yield [column + 1, ROWS - 2];
        }
    }
}

function* generateLevelEnd(levelLength: number): Iterable<[number, number]> {
    for (const row of range(ROWS)) {
        yield [levelLength - 1, row];
    }
}

export default function* generateLevel(levelLength: number): Iterable<[number, number]> {
    yield* generateLevelStart(levelLength);
    yield* generateLevelContent(levelLength);
    yield* generateLevelEnd(levelLength);
}
