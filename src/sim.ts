import Box from './box';
import Vector from './vector';
import World, { ShipAndPosition } from './world';
import { BLOCK_SIZE, COLUMNS, ROWS, DEFAULT_LEVEL_LENGTH, SENSORS_COUNT, DEFAULT_PLAYER_POSITION } from './constants';
import generateLevel from './level_generator';
import RandomShip from './random_ship';
import AIShip from './ai_ship';
import { ACTIONS } from './actions';
import { FeedForwardNetwork, DenseLayer, ReluLayer, SoftmaxLayer } from './net';
import { Matrix2D, uniformRandomDistribution } from './multiply';
import { range } from './utils';

const MAX_FRAMES = 1000;
const GENERATIONS = 10;
const POPULATION = 10;

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

function evaluate(networks: FeedForwardNetwork[]): [FeedForwardNetwork, number][] {
    const players = networks.map(net => new AIShip(DEFAULT_PLAYER_POSITION, net));
    const world = new World(DEFAULT_LEVEL_LENGTH);

    for (const [column, row] of generateLevel(DEFAULT_LEVEL_LENGTH)) {
        world.addBox(column, row);
    }
    for (const player of players) {
        world.addShip(player);
    }
    for (let frame = 0; frame < MAX_FRAMES; frame++) {
        const result: (ShipAndPosition[] | null) = world.update();
        if (result === null) { // nobody won yet
            continue;
        } else { // we have a winner
            break;
        }
    }
    return players.map(player => [player.neuralNetwork, player.position.x]);
}

function evolve(): FeedForwardNetwork[] {
    let population: FeedForwardNetwork[] = range(POPULATION).map(_ => createNeuralNetwork());
    for (let generation = 0; generation < GENERATIONS; generation++) {
        console.log(`Generation ${generation + 1}/${GENERATIONS}`);
        const results = evaluate(population);
        for (const [idx, [net, score]] of results.entries()) {
            console.log(`\tNetwork ${idx} achieved score ${score}`);
        }
        results.sort(
            (
                [aNet, aScore]: [FeedForwardNetwork, number],
                [bNet, bScore]: [FeedForwardNetwork, number]
            ) => bScore - aScore
        );
        population = results.slice(0, POPULATION / 2).map(([net, score]: [FeedForwardNetwork, number]) => net);
        while (population.length < POPULATION) {
            population.push(createNeuralNetwork());
        }
    }
    return population;
}

function main() {
    const networks: FeedForwardNetwork[] = evolve();
    const bestNetwork: FeedForwardNetwork = networks.shift()!;

}

main();
