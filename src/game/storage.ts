import { FeedForwardNetwork } from '../math/net';
import { createNetwork } from '../learning/neural_genetic';

const STORAGE_PREFIX = 'bckp_of_yo'
const { localStorage } = window;

export function storeNetwork(network: FeedForwardNetwork, generation: number): void {
    const serializedWeights = JSON.stringify({
        "generation": generation,
        "weights": network.weights,
    });
    localStorage.setItem(STORAGE_PREFIX, serializedWeights);
}

export function loadNetwork(): [FeedForwardNetwork | undefined, number] {
    const storageItem = localStorage.getItem(STORAGE_PREFIX);
    if (storageItem === null) {
        return [undefined, 0];
    }
    const { "generation": generation, "weights": weights } = JSON.parse(storageItem);
    const weightsArray = Float32Array.from(weights);
    return [createNetwork(weightsArray), generation];

}
