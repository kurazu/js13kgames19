import { FeedForwardNetwork } from './math/net';
import learn from './learning/learn';
import { createNetwork } from './learning/game_genetic';
import Game from './game/game';
import GameScreen from './screens/game_screen';

function onLoad(): void {
    const canvas = document.querySelector<HTMLCanvasElement>('canvas')!;
    const LEARN = true;
    const network: FeedForwardNetwork = (LEARN ? learn : createNetwork)();


    const game = new Game(canvas, new GameScreen({neuralNetwork: network, player: true, bot: true}));
    game.start().catch(err => { console.error('Failed to start the game', err); });
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onLoad, false)
} else {
  onLoad()
}
