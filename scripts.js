import Box from './box';
import Vector from './vector';
import { areColliding } from './collision';
import Keyboard from './keyboard';
import World from './world';
import PlayerShip from './player_ship';
import { BLOCK_SIZE } from './constants';

const WIDTH = 640;
const HEIGHT = 480;
const COLUMNS = WIDTH / BLOCK_SIZE;
const ROWS = HEIGHT / BLOCK_SIZE;

function range(n) {
    return [...Array(n).keys()];
}

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.keyboard = new Keyboard();
        this.loop = this.loop.bind(this);
        this.world = new World();
        for (const column of range(COLUMNS)) {
            this.world.addBox(column, 0);
            this.world.addBox(column, ROWS - 1);
        }
        for (const row of range(ROWS)) {
            this.world.addBox(0, row);
            this.world.addBox(COLUMNS - 1, row);
        }
        this.world.addBox(COLUMNS / 2, ROWS / 2);
        this.world.addBox(COLUMNS / 2 - 1, ROWS / 2);
        this.world.addBox(COLUMNS / 2 + 1, ROWS / 2);
        this.world.addBox(COLUMNS / 2, ROWS / 2 + 1);
        this.world.addBox(COLUMNS / 2, ROWS / 2 - 1);

        const player = new PlayerShip(new Vector(BLOCK_SIZE * COLUMNS / 2, BLOCK_SIZE * (ROWS - 2)), this.keyboard);
        this.world.addShip(player);
    }

    loop () {
        this.world.update();
        this.render();

        requestAnimationFrame(this.loop);
    }

    render() {
        this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
        for (const box of this.world.boxes) {
            this.drawBox(box, '#0000ff');
        }
        for (const ship of this.world.ships) {
            this.drawBox(ship, '#ff0000');
        }
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
