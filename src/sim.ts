import Box from './box';
import Vector from './vector';
import World from './world';
import { BLOCK_SIZE, COLUMNS, ROWS, DEFAULT_LEVEL_LENGTH, SENSORS_COUNT } from './constants';
import generateLevel from './level_generator';
import RandomShip from './random_ship';
import AIShip from './ai_ship';
import { ACTIONS } from './actions';
import { FeedForwardNetwork, DenseLayer, ReluLayer, SoftmaxLayer } from './net';
import { Matrix2D, uniformRandomDistribution } from './multiply';

const DEFAULT_PLAYER_POSITION = new Vector(BLOCK_SIZE * COLUMNS / 2, BLOCK_SIZE * (ROWS - 2))

const MAX_FRAME = 1000;
function main() {
    const net = createNeuralNetwork();
    const aiPlayer = new AIShip(DEFAULT_PLAYER_POSITION, net);
    const randomPlayer = new RandomShip(DEFAULT_PLAYER_POSITION);

    const world = new World(DEFAULT_LEVEL_LENGTH);

    for (const [column, row] of generateLevel(DEFAULT_LEVEL_LENGTH)) {
        world.addBox(column, row);
    }
    world.addShip(randomPlayer);
    world.addShip(aiPlayer);

    let frame = 0;
    function loop() {
        world.update();
        if (frame++ % 100 === 0) {
            console.log(`FRAME ${frame} position AI ${aiPlayer.position.x} ${aiPlayer.position.y}`);
            console.log(`FRAME ${frame} position RANDOM ${randomPlayer.position.x} ${randomPlayer.position.y}`);
        }
        if (frame < MAX_FRAME) {
            setTimeout(loop, 0);
        }
    }

    setTimeout(loop, 0);
}

function createNeuralNetwork() : FeedForwardNetwork {
    const net = new FeedForwardNetwork(SENSORS_COUNT, [
        new DenseLayer(32),
        new ReluLayer(),
        new DenseLayer(ACTIONS.length),
        new SoftmaxLayer()
    ]);
    net.compile();
    return net;
}

main();
