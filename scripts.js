import Box from './box';
import Vector from './vector';
import { areColliding } from './collision';
import Keyboard from './keyboard';
import World from './world';
import PlayerShip from './player_ship';
import { BLOCK_SIZE, MAX_VELOCITY, COLUMNS, ROWS, DEFAULT_LEVEL_LENGTH } from './constants';
import Renderer from './renderer';
import generateLevel from './level_generator';
import { range } from './utils';


class Game {
    constructor(canvas) {
        this.keyboard = new Keyboard();
        this.loop = this.loop.bind(this);
        this.world = new World(DEFAULT_LEVEL_LENGTH);
        for (const [column, row] of generateLevel(DEFAULT_LEVEL_LENGTH)) {
            this.world.addBox(column, row);
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
