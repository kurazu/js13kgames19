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
import { range, randomSample, uniformRandom, randRange } from './utils';

const MIN_FRAMES = 1000;
const MAX_FRAMES = 5000;
const GENERATIONS = 20;
const POPULATION = 30;
const MUTATION_FACTOR = 0.1;
const MATING_FACTOR = 1 / 3;
const KEEP_N_BEST = 3;

export function createNeuralNetwork() : FeedForwardNetwork {
    const net = new FeedForwardNetwork(SENSORS_COUNT, [
        new DenseLayer(32),
        new ReluLayer(),
        new DenseLayer(ACTIONS.length),
        new SoftmaxLayer()
    ]);
    net.compile();
    return net;
}

function evaluate(networks: FeedForwardNetwork[], generation: number): [FeedForwardNetwork, number][] {
    const players = networks.map(net => new AIShip(DEFAULT_PLAYER_POSITION, net));
    const world = new World(DEFAULT_LEVEL_LENGTH);
    const maxFrames = MIN_FRAMES + (MAX_FRAMES - MIN_FRAMES) * generation / (GENERATIONS - 1);
    console.log(`Starting a ${players.length} player race of max ${maxFrames} frames`);

    for (const [column, row] of generateLevel(DEFAULT_LEVEL_LENGTH)) {
        world.addBox(column, row);
    }
    for (const player of players) {
        world.addShip(player);
    }
    for (let frame = 0; frame < maxFrames; frame++) {
        const result: (ShipAndPosition[] | null) = world.update();
        if (result === null) { // nobody won yet
            continue;
        } else { // we have a winner
            console.log('Somebody won the race!');
            break;
        }
    }
    return players.map(player => [player.neuralNetwork, player.position.x]);
}

function getGenes(net: FeedForwardNetwork): Float32Array {
    let totalSize = 0;
    for (const weights of net.getWeights()) {
        totalSize += weights.length;
    }
    const chromosome = new Float32Array(totalSize);
    let address = 0;
    for (const weights of net.getWeights()) {
        chromosome.set(weights, address);
        address += weights.length;
    }
    return chromosome;
}

function networkFromGenes(template: FeedForwardNetwork, genes: Float32Array) {
    const net = template.clone();
    let address = 0;
    for (const weights of net.getWeights()) {
        weights.set(genes.subarray(address, address + weights.length));
        address += weights.length;
    }
    return net;
}

function getInitialPopulation(): FeedForwardNetwork[] {
    return range(POPULATION).map(_ => createNeuralNetwork());
}

function sortByFitness(population: FeedForwardNetwork[], generation: number): FeedForwardNetwork[] {
    const results = evaluate(population, generation);
    for (const [idx, [net, score]] of results.entries()) {
        console.log(`\tNetwork ${idx} achieved score ${score}`);
    }
    results.sort(
        (
            [aNet, aScore]: [FeedForwardNetwork, number],
            [bNet, bScore]: [FeedForwardNetwork, number]
        ) => bScore - aScore
    );
    const [bestNet, bestScore] = results[0];
    console.log(`Best score ${bestScore}`);
    return results.map(([net, score]: [FeedForwardNetwork, number]) => net);
}

function selectParents(population: FeedForwardNetwork[]): FeedForwardNetwork[] {
    return population.slice(0, ~~(population.length * MATING_FACTOR));
}

function getCrossOvers(matingPool: FeedForwardNetwork[]): FeedForwardNetwork[] {
    const offspring = matingPool.slice(0, KEEP_N_BEST);
    while (offspring.length < POPULATION) {
        const [mother, father] = randomSample(matingPool.length, 2).map(idx => matingPool[idx]);
        const motherGenes = getGenes(mother);
        const fatherGenes = getGenes(father);
        const crossOverPoint = randRange(motherGenes.length);
        const childGenes = new Float32Array(motherGenes.length);
        childGenes.set(motherGenes.subarray(0, crossOverPoint), 0);
        childGenes.set(fatherGenes.subarray(crossOverPoint), crossOverPoint);
        offspring.push(networkFromGenes(mother, childGenes));
    }
    return offspring;
}

function getMutations(net: FeedForwardNetwork): FeedForwardNetwork {
    const genes = getGenes(net);
    const numberOfMutations = ~~(genes.length * MUTATION_FACTOR);
    const mutationIndices = randomSample(genes.length, numberOfMutations);
    for (const idx of mutationIndices) {
        genes[idx] = uniformRandom();
    }
    return networkFromGenes(net, genes);
}

function getVariations(matingPool: FeedForwardNetwork[]): FeedForwardNetwork[] {
    const offspring: FeedForwardNetwork[] = getCrossOvers(matingPool);
    return offspring.map(getMutations);
}

export function evolve(): FeedForwardNetwork[] {
    let population: FeedForwardNetwork[] = range(POPULATION).map(_ => createNeuralNetwork());
    for (let generation = 0; generation < GENERATIONS; generation++) {
        console.log(`Generation ${generation + 1}/${GENERATIONS}`);
        population = sortByFitness(population, generation);

        // in last generation we want best parents, not un-evaluated offspring.
        if (generation < GENERATIONS - 1) {
            const matingPool = selectParents(population);
            population = getVariations(matingPool);
        }
    }
    return population;
}

export function evolveBest(): FeedForwardNetwork {
    const networks: FeedForwardNetwork[] = evolve();
    const bestNetwork: FeedForwardNetwork = networks.shift()!;
    return bestNetwork;
}
