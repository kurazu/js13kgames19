import { COLUMNS, ROWS, DEFAULT_LEVEL_LENGTH } from './constants';
import { range } from './utils';

function* generateLevelStart(levelLength) {
    for (const row of range(ROWS)) {
        yield [0, row];
    }
}

function* generateLevelContent(levelLength) {
    for (const column of range(levelLength)) {
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

function* generateLevelEnd(levelLength) {
    for (const row of range(ROWS)) {
        yield [levelLength + 1, row];
    }
}

export default function* generateLevel(levelLength = DEFAULT_LEVEL_LENGTH) {
    yield* generateLevelStart(levelLength);
    yield* generateLevelContent(levelLength);
    yield* generateLevelEnd(levelLength);
}
