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

export const WIDTH = 640;
export const HEIGHT = 480;
export const COLUMNS = WIDTH / BLOCK_SIZE;
export const ROWS = HEIGHT / BLOCK_SIZE;
export const DEFAULT_LEVEL_LENGTH = COLUMNS * 10;

export const SENSORS_COUNT = 30;
export const SENSORS_RANGE = 12
export const DEFAULT_PLAYER_POSITION = new Vector(BLOCK_SIZE * COLUMNS / 2, BLOCK_SIZE * (ROWS - 2));;

export const FEATURES = SENSORS_COUNT + 2;
export const LEARNING_FRAMES = 6;
export const LEARNING_EVERY_N_FRAMES = 20;
export const DENSE_LAYERS = [256, 32];
