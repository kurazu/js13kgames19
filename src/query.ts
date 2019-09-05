import { createNetwork } from './learning/game_genetic';

const network = createNetwork();
console.log('inputs', network.inputWidth);
console.log('wigths', network.weights.length);
