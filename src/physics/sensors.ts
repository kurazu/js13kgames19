import Vector from './vector';
import Ship from '../ships/ship';
import { range } from '../utils';
import { BLOCK_SIZE } from '../constants';

export class Sensor {
    private offset: Vector;

    public constructor(angle: number, distance: number) {
        this.offset = Vector.fromAngleAndLength(angle, distance);
    }

    public getCurrentPosition(ship: Ship): Vector {
        return ship.position.add(this.offset);
    }
}


export function getSensors(count: number, blocks: number): Sensor[][] {
    const angleStep = Math.PI * 2 / count
    const angles = range(count).map(n => n * angleStep);
    const distances = range(blocks).map(n => (n + 1) * BLOCK_SIZE);
    return angles.map(angle => distances.map(distance => new Sensor(angle, distance)));
}
