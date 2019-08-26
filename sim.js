import Box from './box';
import { areColliding } from './collision';

const staticBox = new Box(100, 100, 50, 50);
const coords = [[100, 100], [0, 0], [50, 50]];
for (let [x, y] of coords) {
    const flying = new Box(x, y, 100, 50);
    const collides = areColliding(staticBox, flying);
    console.log(`x=${x} y=${y} collides=${collides}`);
    if (areColliding(flying, staticBox) !== collides) {
        throw new Error('symmetry');
    }
}
