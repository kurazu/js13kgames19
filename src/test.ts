import { Matrix2D, dot } from './multiply';

const A = new Matrix2D(2, 3);
A.setRow(0, Float32Array.from([1,2,3]));
A.setRow(1, Float32Array.from([4,5,6]));

const B = new Matrix2D(3, 4);
B.setRow(0, Float32Array.from([1,2,3,4]));
B.setRow(1, Float32Array.from([5,6,7,8]));
B.setRow(2, Float32Array.from([9,10,11,12]));

const C = dot(A, B);
console.log(C);
