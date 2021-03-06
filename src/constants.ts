import Vector from './physics/vector';


export const BLOCK_SIZE = 32;
export const FPS = 60;
export const TIME_DELTA = 1 / FPS;
export const MAX_VELOCITY = BLOCK_SIZE / TIME_DELTA;
export const GRAVITY_ACCELERATION = new Vector(0, -BLOCK_SIZE * 2);
export const UPWARD_THRUST_ACCELERATION = new Vector(0, BLOCK_SIZE * 12);
export const LEFT_THRUST_ACCELERATION = new Vector(-BLOCK_SIZE * 8, 0);
export const RIGHT_THRUST_ACCELERATION = LEFT_THRUST_ACCELERATION.multiplyByScalar(-1);
export const FRICTION = 1 - 0.05;
export const AIR_FRICTION = 1 - 0.005;

export const WIDTH = 1024;
export const HEIGHT = 576;
export const COLUMNS = WIDTH / BLOCK_SIZE;
export const ROWS = HEIGHT / BLOCK_SIZE;
export const DEFAULT_LEVEL_LENGTH = COLUMNS * 10;

export const SENSORS_COUNT: number = 20;
export const SENSORS_RANGE: number = 15;
export const DEFAULT_PLAYER_POSITION = new Vector(BLOCK_SIZE * 4, BLOCK_SIZE * ROWS / 2);

export const FEATURES: number = SENSORS_COUNT + 3;
export const LEARNING_FRAMES: number = 6;
export const LEARNING_EVERY_N_FRAMES: number = FPS;
export const DENSE_LAYERS: number[] = [64];

export const enum Tiles {
    MIDDLE_WALL = 0,
    BOTTOM_WALL = 1,
    TOP_WALL = 2,
    STEM = 3,
    RED_CAP_LEFT = 4,
    RED_CAP_MIDDLE = 5,
    RED_CAP_RIGHT = 6,
    BROWN_CAP_LEFT = 7,
    BROWN_CAP_MIDDLE = 8,
    BROWN_CAP_RIGHT = 9
}

export const TARGET_AIRMILES = 100;
export const RECORDING_LEVEL_LENGTH_FACTOR = 1.75;
export const RECORDING_TARGET_TIME = 80;

export const SUPERVISED_GENERATIONS = 20;
export const UNSUPERVISED_GENERATIONS = 200;

export const POPULATION_SIZE = 50;
export const MATING_POOL_SIZE = 10;
export const ELITE_SIZE = 3;
export const ASEXUAL_REPRODUCTION_SIZE = 3;
export const MUTATION_FACTOR = 0.05;
export const UNSUPERVISED_MIN_FRAMES = 60 * 10;
export const UNSUPERVISED_MAX_FRAMES = 60 * 60;
