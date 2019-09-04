import { Matrix2D, dot } from './multiply';


const ITERATIONS = 100;

function main() {
    const before = +new Date;
    for (let i = 0; i < ITERATIONS; i++) {
        const a = new Matrix2D(1, 2048);
        const b = new Matrix2D(2048, 6);
        dot(a, b)
    }
    const diff = (+new Date) - before;
    console.log(diff / ITERATIONS, 'ms/iteration');
}

main();
