import Box from './box';
import Vector from './vector';
import { areColliding } from './collision';
import Keyboard from './keyboard';
import World from './world';
import PlayerShip from './player_ship';
import { BLOCK_SIZE, MAX_VELOCITY, COLUMNS, ROWS } from './constants';
import Renderer from './renderer';

function range(n) {
    return [...Array(n).keys()];
}

class Game {
    constructor(canvas) {
        this.keyboard = new Keyboard();
        this.loop = this.loop.bind(this);
        this.world = new World();
        for (const column of range(COLUMNS * 2)) {
            this.world.addBox(column, 0);
            this.world.addBox(column, ROWS - 1);
        }
        for (const row of range(ROWS)) {
            this.world.addBox(0, row);
            this.world.addBox(COLUMNS * 2 - 1, row);
        }
        this.world.addBox(COLUMNS / 2, ROWS / 2);
        this.world.addBox(COLUMNS / 2 - 1, ROWS / 2);
        this.world.addBox(COLUMNS / 2 + 1, ROWS / 2);
        this.world.addBox(COLUMNS / 2, ROWS / 2 + 1);
        this.world.addBox(COLUMNS / 2, ROWS / 2 - 1);
        for (const column of range(5)) {
            this.world.addBox(COLUMNS / 2 - 2 + column, ROWS / 2 - 3);
        }

        const player = new PlayerShip(new Vector(BLOCK_SIZE * COLUMNS / 2, BLOCK_SIZE * (ROWS - 2)), this.keyboard);
        this.world.addShip(player);

        this.renderer = new Renderer(canvas, player);
    }

    loop () {
        this.world.update();
        this.renderer.render(this.world);

        requestAnimationFrame(this.loop);
    }

    start() {
        this.renderer.start();
        this.keyboard.start();
        requestAnimationFrame(this.loop);
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
