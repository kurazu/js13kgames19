import Box from './box';
import Vector from './vector';
import {
    BLOCK_SIZE,
    GRAVITY_ACCELERATION,
    UPWARD_THRUST_ACCELERATION,
    LEFT_THRUST_ACCELERATION,
    RIGHT_THRUST_ACCELERATION,
    TIME_DELTA,
    MAX_VELOCITY
} from './constants';

const BOX_SIZE = new Vector(BLOCK_SIZE, BLOCK_SIZE);

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

    update() {
        for (const ship of this.ships) {
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
            const positionChange = ship.velocity.multiplyByScalar(TIME_DELTA);
            ship.position.addInplace(positionChange);
        }
    }
}
