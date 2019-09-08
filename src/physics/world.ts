import Box from './box';
import Vector from './vector';
import {
    BLOCK_SIZE,
    GRAVITY_ACCELERATION,
    UPWARD_THRUST_ACCELERATION,
    LEFT_THRUST_ACCELERATION,
    RIGHT_THRUST_ACCELERATION,
    TIME_DELTA,
    MAX_VELOCITY,
    FRICTION,
    SENSORS_COUNT,
    SENSORS_RANGE,
    DEFAULT_LEVEL_LENGTH,
    DEFAULT_PLAYER_POSITION
} from '../constants';
import { areColliding, SensorsState } from './collision';
import Ship from '../ships/ship';
import { minBy } from '../utils';
import { getSensors, Sensor } from './sensors';
import generateLevel from './level_generator';

const BOX_SIZE = new Vector(BLOCK_SIZE, BLOCK_SIZE);

const COLLISION_STEPS = [1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.0];

function movedBox(box: Box, newPosition: Vector) {
    const movedObject = Object.create(box);
    movedObject.position = newPosition;
    return movedObject;
}

export type ShipAndPosition = [Ship, number];

type BoxColumn = Map<number, Box>
const EMPTY_MAP: BoxColumn = new Map();

export default class World {
    private boxes: Map<number, BoxColumn>;
    public ships: Ship[];
    public sensors: Sensor[][];
    public readonly finishX: number;

    public constructor(levelLength: number = DEFAULT_LEVEL_LENGTH) {
        this.sensors = getSensors(SENSORS_COUNT, SENSORS_RANGE);
        this.boxes = new Map();
        this.ships = [];
        this.finishX = levelLength * BLOCK_SIZE;
        for (const [column, row] of generateLevel(levelLength)) {
            this.addBox(column, row);
        }
    }

    public reset(): void {
        this.ships = [];
    }

    public addBox(column: number, row: number): Box {
        const position = new Vector((column + 0.5) * BLOCK_SIZE, (row + 0.5) * BLOCK_SIZE);
        const box = new Box(position, BOX_SIZE);
        let columnMap = this.boxes.get(column);
        if (!columnMap) {
            columnMap = new Map();
            this.boxes.set(column, columnMap);
        }
        columnMap.set(row, box);
        return box;
    }

    public getBoxes(minX: number, maxX: number): Box[] {
        const result: Box[] = [];
        const minXIndex = ~~(minX / BLOCK_SIZE) - 1;
        const maxXIndex = ~~(maxX / BLOCK_SIZE) + 1;
        for (let idx = minXIndex; idx < maxXIndex; idx++) {
            const columnBoxes: BoxColumn = this.boxes.get(idx) || EMPTY_MAP;
            for (const box of columnBoxes.values()) {
                result.push(box);
            }
        }
        return result;
    }

    public getBox(position: Vector): Box | undefined {
        const column = ~~(position.x / BLOCK_SIZE);
        const row = ~~(position.y / BLOCK_SIZE);
        const columnBoxes = this.boxes.get(column);
        if (!columnBoxes) {
            return undefined;
        }
        return columnBoxes.get(row);
    }

    public addShip(ship: Ship): void {
        ship.position = DEFAULT_PLAYER_POSITION.clone();
        ship.velocity.multiplyByScalarInplace(0);
        this.ships.push(ship);
    }

    private getState(ship: Ship): SensorsState {
        return this.sensors.map(
            sensors => sensors.findIndex(sensor => this.getBox(sensor.getCurrentPosition(ship)))
        ).map(
            index => index === -1 ? null : index
        );
    }

    private updateShip(ship: Ship) {
        const state = this.getState(ship);
        const {up, left, right} = ship.getControls(state);
        const accelerations = [GRAVITY_ACCELERATION];
        if (up) {
            accelerations.push(UPWARD_THRUST_ACCELERATION);
        }
        if (left) {
            accelerations.push(LEFT_THRUST_ACCELERATION);
        }
        if (right) {
            accelerations.push(RIGHT_THRUST_ACCELERATION);
        }
        const acceleration = Vector.add(accelerations);
        const velocityChange = acceleration.multiplyByScalar(TIME_DELTA);
        ship.velocity.addInplace(velocityChange);
        ship.velocity.trim(MAX_VELOCITY);
        const desiredPositionChange = ship.velocity.multiplyByScalar(TIME_DELTA);
        const desiredPosition = ship.position.add(desiredPositionChange);
        const movedShip = movedBox(ship, desiredPosition);
        const collidingBoxes = this.checkCollisions(movedShip);
        delete ship.touching;
        if (collidingBoxes.length) {
            /* we cannot make a full move */
            /* check if we can make a full vertical move */
            const oldPosition = ship.position.clone();
            const oldShip = movedBox(ship, oldPosition);
            const verticallyCollidingBoxes = this.checkCollisions(movedBox(oldShip, new Vector(ship.position.x, desiredPosition.y)), collidingBoxes);
            if (verticallyCollidingBoxes.length) {
                /* we can't, let's try to come as close as possible to the nearest box. */
                const [nearestBox, distance] = minBy(verticallyCollidingBoxes, box => Math.abs(box.position.y - ship.position.y));
                if (ship.position.y < nearestBox.position.y) {
                    ship.top = nearestBox.bottom;
                } else {
                    ship.bottom = nearestBox.top;
                }
                /* let's clear velocity along this axis. */
                ship.velocity.y = 0;
            } else {
                /* we can, let's move along the vertical axis. */
                ship.position.y = desiredPosition.y;
            }
            const horizontallyCollidingBoxes = this.checkCollisions(movedBox(oldShip, new Vector(desiredPosition.x, ship.position.y)), collidingBoxes);
            /* check if we can make a full horizontal move */
            if (horizontallyCollidingBoxes.length) {
                /* we can't. let's come as close as possible to the nearest box. */
                const [nearestBox, distance] = minBy(horizontallyCollidingBoxes, box => Math.abs(box.position.x - ship.position.x));
                if (ship.position.x < nearestBox.position.x) {
                    ship.right = nearestBox.left;
                } else {
                    ship.left = nearestBox.right;
                }
                /* let's clear velocity along this axis. */
                ship.velocity.x = 0;
            } else {
                /* we can, let's move along the vertical axis. */
                ship.position.x = desiredPosition.x;
            }
            /* and let's apply friction */
            ship.velocity.multiplyByScalarInplace(FRICTION);
            ship.touching = true;
        } else {
            /* full move is possible */
            ship.position = desiredPosition;
        }
    }

    public update(): ShipAndPosition[] | null {
        for (const ship of this.ships) {
            this.updateShip(ship);
        }

        const shipsWithPositions: ShipAndPosition[] = this.ships.map(ship => [ship, ship.position.x]);
        shipsWithPositions.sort(([shipA, positionA]: ShipAndPosition, [shipB, positionB]: ShipAndPosition) => positionB - positionA);
        if (shipsWithPositions.some(([ship, position]: ShipAndPosition) => position > this.finishX)) {
            return shipsWithPositions;
        } else {
            return null;
        }
    }

    private checkCollisions(ship: Ship, boxes: Box[] = this.getBoxes(ship.left, ship.right)): Box[] {
        return boxes.filter(box => areColliding(box, ship));
    }
}