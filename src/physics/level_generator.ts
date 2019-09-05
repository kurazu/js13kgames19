import { COLUMNS, ROWS } from '../constants';
import { range, randRange } from '../utils';

const START_LENGTH = 20;
const END_LENGTH = 1;

function* generateLevelStart(levelLength: number): Iterable<[number, number]> {
    for (const row of range(ROWS)) {
        yield [0, row];

    }
    for (const column of range(START_LENGTH - 1)) {
        yield [column + 1, 0];
        yield [column + 1, ROWS - 1];
    }
}

function* generateLevelContent(levelLength: number): Iterable<[number, number]> {
    for (const column of range(levelLength - START_LENGTH - END_LENGTH)) {
        yield [column + START_LENGTH, 0];
        yield [column + START_LENGTH, ROWS - 1];

        if (column % 4 == 0) {
            const centerY = randRange(ROWS - 2);
            yield [column + START_LENGTH, centerY];
            yield [column + START_LENGTH - 1, centerY];
            yield [column + START_LENGTH + 1, centerY];
            yield [column + START_LENGTH, centerY - 1];
            yield [column + START_LENGTH, centerY + 1];
        }
    }
}

function* generateLevelEnd(levelLength: number): Iterable<[number, number]> {
    for (const row of range(ROWS / 3)) {
        yield [levelLength - 1, row];
        yield [levelLength - 1, ROWS - 1 - row];
    }

}

export default function* generateLevel(levelLength: number): Iterable<[number, number]> {
    yield* generateLevelStart(levelLength);
    yield* generateLevelContent(levelLength);
    yield* generateLevelEnd(levelLength);
}
