import { WIDTH, HEIGHT, MAX_VELOCITY } from './constants';
import Vector from './vector';

const PLAYER_X_AT = 1 / 3;

class Camera {
    constructor(trackedShip, levelLength) {
        this.trackedShip = trackedShip;
        this.levelLength = levelLength;
    }

    getScreenX(physicsX) {
        return PLAYER_X_AT * WIDTH + physicsX - this.trackedShip.position.x;
    }

    getScreenY(physicsY) {
        return HEIGHT - physicsY;
    }

    getScreenPosition(box) {
        const {left, top} = box;
        return new Vector(
            this.getScreenX(left),
            this.getScreenY(top)
        );
    }

    getScreenLeft() {
        return this.trackedShip.position.x - PLAYER_X_AT * WIDTH;
    }

    getScreenRight() {
        return this.trackedShip.position.x + (1 - PLAYER_X_AT) * WIDTH;
    }
}

export default class Renderer {
    constructor(canvas, trackedShip, levelLength) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.camera = new Camera(trackedShip, levelLength);
    }

    start() {
        this.canvas.width = WIDTH;
        this.canvas.height = HEIGHT;
    }

    render(world) {
        this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
        const screenLeft = this.camera.getScreenLeft();
        const screenRight = this.camera.getScreenRight();
        for (const box of world.getBoxes(screenLeft, screenRight)) {
            this.drawBox(box, '#0000ff');
        }
        for (const ship of world.ships) {
            const intensity = ~~(255 * ship.velocity.length() / MAX_VELOCITY);
            let r = 0, g = 0, b = intensity;
            if (ship.touching) {
                r = 255;
            } else {
                g = 255;
            }
            this.drawBox(ship, `rgb(${r}, ${g}, ${b}`);
        }
    }

    drawBox(box, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(...this.camera.getScreenPosition(box), ...box.size);
    }
}
