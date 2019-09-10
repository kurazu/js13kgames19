import { createNetwork } from './learning/neural_genetic';

const network = createNetwork();
console.log('inputs', network.inputWidth);
console.log('weights', network.weights.length);
console.log('size', network.weights.byteLength);
