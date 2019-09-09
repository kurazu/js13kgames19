import { COLUMNS, ROWS, Tiles } from '../constants';
import { range, randRange, randRange2 } from '../utils';

type TileIterable = Iterable<[number, number, Tiles]>;

const START_LENGTH = 10;
const END_LENGTH = 10;

function* generateLevelStart(levelLength: number): TileIterable {
    for (const row of range(ROWS)) {
        yield [0, row, Tiles.MIDDLE_WALL];

    }
    for (const column of range(START_LENGTH - 1)) {
        yield [column + 1, 0, Tiles.BOTTOM_WALL];
        yield [column + 1, ROWS - 1, Tiles.TOP_WALL];
    }
}

const PLATFORM_MIN_LENGTH = 8;
const PLATFORM_MAX_LENGTH = 20;
const MUSHROOM_MIN_HEIGHT = 2;
const MUSHROOM_MAX_HEIGHT = ROWS - 2 - 1;
const MUSHROOM_MIN_RADIUS = 1;
const MUSHROOM_MAX_RADIUS = 3;
const MIN_HORIZONTAL_SPACE = MUSHROOM_MAX_RADIUS * 2 + 3;
const MAX_HORIZONTAL_SPACE = 10;

const MIN_PLATFORM_LEVEL = 3;
const MAX_PLATFORM_LEVEL = ROWS - 1 - 3;
const MIN_PLATFORM_HEIGHT = 1;
const MAX_PLATFORM_HEIGHT = 3;


function* generateCeilingMushroom(column: number): TileIterable {
    const height = randRange2(MUSHROOM_MIN_HEIGHT, MUSHROOM_MAX_HEIGHT);
    const radius = randRange2(MUSHROOM_MIN_RADIUS, MUSHROOM_MAX_RADIUS);
    // stem
    for (let row = 1; row < height; row++) {
        yield [column, ROWS - 1 - row, Tiles.STEM];
    }
    // cap
    yield [column, ROWS -1 - height, Tiles.BROWN_CAP_MIDDLE]
    for (let r = 1; r <= radius; r++) {
        yield [column + r, ROWS - 1 - height, r === radius ? Tiles.BROWN_CAP_RIGHT : Tiles.BROWN_CAP_MIDDLE];
        yield [column - r, ROWS - 1 - height, r === radius ? Tiles.BROWN_CAP_LEFT : Tiles.BROWN_CAP_MIDDLE];
    }
}

function* generateFloorMushroom(column: number): TileIterable {
    const height = randRange2(MUSHROOM_MIN_HEIGHT, MUSHROOM_MAX_HEIGHT);
    const radius = randRange2(MUSHROOM_MIN_RADIUS, MUSHROOM_MAX_RADIUS);
    // stem
    for (let row = 1; row < height; row++) {
        yield [column, row, Tiles.STEM];
    }
    // cap
    yield [column, height, Tiles.RED_CAP_MIDDLE];
    for (let r = 1; r <= radius; r++) {
        yield [column + r, height, r === radius ? Tiles.RED_CAP_RIGHT : Tiles.RED_CAP_MIDDLE];
        yield [column - r, height, r === radius ? Tiles.RED_CAP_LEFT : Tiles.RED_CAP_MIDDLE];
    }
}

function* generatePlatform(column: number): TileIterable {
    const height = randRange2(MIN_PLATFORM_HEIGHT, MAX_PLATFORM_HEIGHT);
    const level = randRange2(MIN_PLATFORM_LEVEL, MAX_PLATFORM_LEVEL);
    if (height === 1) {
        yield [column, level, Tiles.BOTTOM_WALL];
    } else if (height === 2) {
        yield [column, level, Tiles.TOP_WALL];
        yield [column + 1, level, Tiles.TOP_WALL];
        yield [column, level + 1, Tiles.BOTTOM_WALL];
        yield [column + 1, level + 1, Tiles.BOTTOM_WALL];
    } else {
        yield [column, level, Tiles.MIDDLE_WALL];
        yield [column - 1, level, Tiles.BOTTOM_WALL];
        yield [column + 1, level, Tiles.BOTTOM_WALL];
        yield [column, level - 1, Tiles.TOP_WALL];
        yield [column, level + 1, Tiles.BOTTOM_WALL];
    }
}

function* generateLevelContent(levelLength: number): TileIterable {
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
        yield [column + START_LENGTH, 0, Tiles.BOTTOM_WALL];
        yield [column + START_LENGTH, ROWS - 1, Tiles.TOP_WALL];

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

function* generateLevelEnd(levelLength: number): TileIterable {
    for (const column of range(END_LENGTH)) {
        yield [levelLength - END_LENGTH + column, 0, Tiles.BOTTOM_WALL];
        yield [levelLength - END_LENGTH + column, ROWS - 1, Tiles.TOP_WALL];
    }
}

export default function* generateLevel(levelLength: number): TileIterable {
    yield* generateLevelStart(levelLength);
    yield* generateLevelContent(levelLength);
    yield* generateLevelEnd(levelLength);
}
