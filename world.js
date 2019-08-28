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
    FRICTION
} from './constants';
import { areColliding } from './collision';

const BOX_SIZE = new Vector(BLOCK_SIZE, BLOCK_SIZE);

const COLLISION_STEPS = [1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.0];

function movedBox(box, newPosition) {
    const movedObject = Object.create(box);
    movedObject.position = newPosition;
    return movedObject;
}

function minBy(items, measureCallback) {
    const first = items[0];
    const firstMeasure = measureCallback(first);
    return items.slice(1).reduce(([bestItem, bestMeasure], item) => {
        const measure = measureCallback(item);
        if (measure < bestMeasure) {
            return [item, measure];
        } else {
            return [bestItem, bestMeasure];
        }
    }, [first, firstMeasure]);
}

export default class World {
    constructor() {
        this.boxes = [];
        this.ships = [];
    }

    addBox(x, y) {
        const position = new Vector((x + 0.5) * BLOCK_SIZE, (y + 0.5) * BLOCK_SIZE);
        const box = new Box(position, BOX_SIZE);
        this.boxes.push(box);
    }

    addShip(ship) {
        this.ships.push(ship);
    }

    updateShip(ship) {
        const {up, left, right} = ship.getControls();
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

    update() {
        for (const ship of this.ships) {
            this.updateShip(ship);
        }
    }

    checkCollisions(ship, boxes = this.boxes) {
        return boxes.filter(box => areColliding(box, ship));
    }
}
