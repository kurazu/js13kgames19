import { WIDTH, HEIGHT, MAX_VELOCITY } from './constants';
import Vector from './vector';

const PLAYER_X_AT = WIDTH / 3;

class Camera {
    constructor(trackedShip) {
        this.trackedShip = trackedShip;
    }

    getScreenPosition(box) {
        const {left, top} = box;
        const trackedShipX = this.trackedShip.position.x;
        return new Vector(PLAYER_X_AT + left - trackedShipX, HEIGHT - top);
    }
}

export default class Renderer {
    constructor(canvas, trackedShip) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.camera = new Camera(trackedShip);
    }

    start() {
        this.canvas.width = WIDTH;
        this.canvas.height = HEIGHT;
    }

    render(world) {
        this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
        for (const box of world.boxes) {
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
