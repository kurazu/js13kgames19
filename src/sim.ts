import Box from './box';
import Vector from './vector';
import World from './world';
import { BLOCK_SIZE, COLUMNS, ROWS, DEFAULT_LEVEL_LENGTH } from './constants';
import generateLevel from './level_generator';
import RandomShip from './random_ship';
import { FeedForwardNetwork, DenseLayer, ReluLayer, SoftmaxLayer } from './net';
import { Matrix2D, uniformRandomDistribution } from './multiply';

const DEFAULT_PLAYER_POSITION = new Vector(BLOCK_SIZE * COLUMNS / 2, BLOCK_SIZE * (ROWS - 2))

const MAX_FRAME = 1000;
function xmain() {
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

function main() {
    const inputFeatures = 20;
    const hidden = 10;
    const outputs = 3;
    const net = new FeedForwardNetwork(inputFeatures, [
        new DenseLayer(hidden),
        new ReluLayer(),
        new DenseLayer(outputs),
        new SoftmaxLayer()
    ]);
    net.compile();
    const input = new Matrix2D(2, inputFeatures);
    uniformRandomDistribution(input.buffer, 1);
    const result = net.calculate(input);
    console.log(result.toString());
}

main();
