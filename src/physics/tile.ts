import Box from './box';
import { BLOCK_SIZE, Tiles } from '../constants';
import Vector from './vector';

const SIZE = new Vector(BLOCK_SIZE, BLOCK_SIZE);

export default class Tile extends Box {
    public tile: Tiles;

    constructor(position: Vector, tile: Tiles) {
        super(position, SIZE);
        this.tile = tile;
    }
}
