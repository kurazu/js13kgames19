import { COLUMNS, ROWS } from './constants';
import { range, randRange } from './utils';

function* generateLevelStart(levelLength: number): Iterable<[number, number]> {
    for (const row of range(ROWS)) {
        yield [0, row];
    }
}

function* generateLevelContent(levelLength: number): Iterable<[number, number]> {
    for (const column of range(levelLength - 2)) {
        yield [column + 1, 0];
        yield [column + 1, ROWS - 1];

        if (column % 3 == 0) {
            const centerY = randRange(ROWS - 2) + 1;
            yield [column, centerY];
            yield [column - 1, centerY];
            yield [column + 1, centerY];
            yield [column, centerY - 1];
            yield [column, centerY + 1];
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
