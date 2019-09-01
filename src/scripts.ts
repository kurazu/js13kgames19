import Box from './box';
import Vector from './vector';
import { areColliding } from './collision';
import Keyboard from './keyboard';
import World from './world';
import PlayerShip from './player_ship';
import Ship from './ship';
import { BLOCK_SIZE, MAX_VELOCITY, COLUMNS, ROWS, DEFAULT_LEVEL_LENGTH, DEFAULT_PLAYER_POSITION } from './constants';
import Renderer from './renderer';
import generateLevel from './level_generator';
import { range } from './utils';

class Game {
    private keyboard: Keyboard;
    private world: World;
    private renderer: Renderer;
    private player: Ship;

    public constructor(canvas: HTMLCanvasElement) {
        this.keyboard = new Keyboard();
        this.loop = this.loop.bind(this);
        this.player = new PlayerShip(DEFAULT_PLAYER_POSITION.clone(), this.keyboard);
        this.renderer = new Renderer(canvas, this.player, DEFAULT_LEVEL_LENGTH);
        this.world = new World(DEFAULT_LEVEL_LENGTH);
        this.newLevel();
    }

    private newLevel() {
        this.world = new World(DEFAULT_LEVEL_LENGTH);
        for (const [column, row] of generateLevel(DEFAULT_LEVEL_LENGTH)) {
            this.world.addBox(column, row);
        }
        this.player.position = DEFAULT_PLAYER_POSITION.clone();
        this.player.velocity.multiplyByScalarInplace(0);
        this.world.addShip(this.player);
    }

    private loop(): void {
        const sortedShips = this.world.update();
        this.renderer.render(this.world);

        if (sortedShips) {
            this.newLevel();
        }

        requestAnimationFrame(this.loop);
    }

    public start(): void {
        this.renderer.start();
        this.keyboard.start();
        requestAnimationFrame(this.loop);
    }
}

function onLoad(): void {
    const canvas = document.querySelector<HTMLCanvasElement>('canvas');
    if (!canvas) {
        throw new Error("Canvas not found");
    }
    const game = new Game(canvas);
    game.start();
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onLoad, false)
} else {
  onLoad()
}
