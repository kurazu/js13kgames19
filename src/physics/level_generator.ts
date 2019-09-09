import { COLUMNS, ROWS } from '../constants';
import { range, randRange, randRange2 } from '../utils';

const START_LENGTH = 10;
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

const PLATFORM_MIN_LENGTH = 8;
const PLATFORM_MAX_LENGTH = 20;
const MUSHROOM_MIN_HEIGHT = 2;
const MUSHROOM_MAX_HEIGHT = ROWS - 2 - 1;
const MUSHROOM_MIN_RADIUS = 1;
const MUSHROOM_MAX_RADIUS = 3;
const MIN_HORIZONTAL_SPACE = MUSHROOM_MAX_RADIUS * 2 + 2;
const MAX_HORIZONTAL_SPACE = 10;

const MIN_PLATFORM_LEVEL = 3;
const MAX_PLATFORM_LEVEL = ROWS - 1 - 3;
const MIN_PLATFORM_HEIGHT = 1;
const MAX_PLATFORM_HEIGHT = 3;

function* generateCeilingMushroom(column: number): Iterable<[number, number]> {
    const height = randRange2(MUSHROOM_MIN_HEIGHT, MUSHROOM_MAX_HEIGHT);
    const radius = randRange2(MUSHROOM_MIN_RADIUS, MUSHROOM_MAX_RADIUS);
    // stem
    for (let row = 1; row <= height; row++) {
        yield [column, ROWS - 1 - row];
    }
    // cap
    for (let r = 1; r <= radius; r++) {
        yield [column + r, ROWS - 1 - height];
        yield [column - r, ROWS - 1 - height];
    }
}

function* generateFloorMushroom(column: number): Iterable<[number, number]> {
    const height = randRange2(MUSHROOM_MIN_HEIGHT, MUSHROOM_MAX_HEIGHT);
    const radius = randRange2(MUSHROOM_MIN_RADIUS, MUSHROOM_MAX_RADIUS);
    // stem
    for (let row = 1; row <= height; row++) {
        yield [column, row];
    }
    // cap
    for (let r = 1; r <= radius; r++) {
        yield [column + r, height];
        yield [column - r, height];
    }
}

function* generatePlatform(column: number): Iterable<[number, number]> {
    const height = randRange2(MIN_PLATFORM_HEIGHT, MAX_PLATFORM_HEIGHT);
    const level = randRange2(MIN_PLATFORM_LEVEL, MAX_PLATFORM_LEVEL);
    yield [column, level];
    if (height === 1) {
    } else if (height === 2) {
        yield [column + 1, level];
        yield [column, level + 1];
        yield [column + 1, level + 1];
    } else {
        yield [column, level];
        yield [column - 1, level];
        yield [column + 1, level];
        yield [column, level - 1];
        yield [column, level + 1];
    }
}

function* generateLevelContent(levelLength: number): Iterable<[number, number]> {
    let column = START_LENGTH;

    while (column < levelLength - END_LENGTH) {
        const random = Math.random()
        if (random < 0.4) {
            yield* generateCeilingMushroom(column);
        } else if (random < 0.8) {
            yield* generateFloorMushroom(column);
        } else {
            yield* generatePlatform(column);
        }
        column += randRange2(MIN_HORIZONTAL_SPACE, MAX_HORIZONTAL_SPACE);
        // if (column % 10 === 0) {
        //     const generators: () => Iterable[number, number] = [generateCeilingMushroom, generateFloorMushroom];
        //     if (platformLevel) {
        //         generators.push(generateMushroomOnPlatform.bind(undefined, platformLevel));
        //         generators.push(generateMushroomUnderPlatform.bind(undefined, platformLevel));
        //     }
        //     const generator
        // }

        // yield [column, 0];
        // yield [column, ROWS - 1];
        // if (platformLevel) {
        //     yield [column, platformLevel];
        // }
        // column++;
    }

    for (const column of range(levelLength - START_LENGTH - END_LENGTH)) {
        yield [column + START_LENGTH, 0];
        yield [column + START_LENGTH, ROWS - 1];

    //     if (column % 4 == 0) {
    //         const centerY = randRange(ROWS - 2);
    //         yield [column + START_LENGTH, centerY];
    //         yield [column + START_LENGTH - 1, centerY];
    //         yield [column + START_LENGTH + 1, centerY];
    //         yield [column + START_LENGTH, centerY - 1];
    //         yield [column + START_LENGTH, centerY + 1];
    //     }
    }
}

function* generateLevelEnd(levelLength: number): Iterable<[number, number]> {
    for (const row of range(~~(ROWS / 3))) {
        yield [levelLength - 1, row];
        yield [levelLength - 1, ROWS - 1 - row];
    }

}

export default function* generateLevel(levelLength: number): Iterable<[number, number]> {
    yield* generateLevelStart(levelLength);
    yield* generateLevelContent(levelLength);
    yield* generateLevelEnd(levelLength);
}
