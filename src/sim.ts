import Box from './box';
import Vector from './vector';
import World from './world';
import { BLOCK_SIZE, COLUMNS, ROWS, DEFAULT_LEVEL_LENGTH } from './constants';
import generateLevel from './level_generator';
import RandomShip from './random_ship';

const DEFAULT_PLAYER_POSITION = new Vector(BLOCK_SIZE * COLUMNS / 2, BLOCK_SIZE * (ROWS - 2))

const MAX_FRAME = 1000;
function main() {
    const world = new World(DEFAULT_LEVEL_LENGTH);
    const player = new RandomShip(DEFAULT_PLAYER_POSITION);
    for (const [column, row] of generateLevel(DEFAULT_LEVEL_LENGTH)) {
        world.addBox(column, row);
    }
    world.addShip(player);

    let frame = 0;
    function loop() {
        world.update();
        if (frame++ % 100 === 0) {
            console.log(`FRAME ${frame} position ${player.position.x} ${player.position.y}`)
        }
        if (frame < MAX_FRAME) {
            setTimeout(loop, 0);
        }
    }

    setTimeout(loop, 0);
}

main();
