import Box from './box';
import Vector from './vector';
import { areColliding } from './collision';
import Keyboard from './keyboard';

const WIDTH = 640 / 2;
const HEIGHT = 480 / 2;

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.keyboard = new Keyboard();
        this.loop = this.loop.bind(this);

        this.staticBox = new Box(new Vector(100, 100), new Vector(50, 50));
        this.flyingBox = new Box(new Vector(100, 100), new Vector(150, 100));
    }

    loop () {
        this.update();
        this.render();

        requestAnimationFrame(this.loop);
    }

    render() {
        this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
        this.drawBox(this.staticBox, '#0000ff');
        this.drawBox(this.flyingBox, areColliding(this.staticBox, this.flyingBox) ? '#ff0000' : '#00ff00');
    }

    update() {
        const SPEED = 50 /* px */ / 1000 /* ms */;
        const DT = 1000 /* ms */ / 60 /* FPS */;
        const INCREMENT = SPEED * DT;
        if (this.keyboard.isPressed('ArrowRight')) {
            this.flyingBox.position.x += INCREMENT;
        } else if (this.keyboard.isPressed('ArrowLeft')) {
            this.flyingBox.position.x -= INCREMENT;
        } else if (this.keyboard.isPressed('ArrowUp')) {
            this.flyingBox.position.y += INCREMENT;
        } else if (this.keyboard.isPressed('ArrowDown')) {
            this.flyingBox.position.y -= INCREMENT;
        } else {
            return;
        }
    }

    start() {
        this.canvas.width = WIDTH;
        this.canvas.height = HEIGHT;
        this.keyboard.start();
        requestAnimationFrame(this.loop);
    }

    drawBox(box, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(box.left, HEIGHT - box.top, box.size.x, box.size.y);
    }
}

function onLoad() {
    const canvas = document.getElementById('canvas');
    const game = new Game(canvas);
    game.start();
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onLoad, false)
} else {
  onLoad()
}
