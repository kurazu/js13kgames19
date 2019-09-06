import { FeedForwardNetwork } from './math/net';
import learn from './learning/learn';
import { createNetwork } from './learning/game_genetic';
import Game from './game/game';
import GameScreen from './screens/game_screen';
import ComputingScreen from './screens/computing_screen';
import RecordingScreen from './screens/recording_screen';

function onLoad(): void {
    const canvas = document.querySelector<HTMLCanvasElement>('canvas')!;
    // const network: FeedForwardNetwork = (LEARN ? learn : createNetwork)();
    // const gameScreen = new GameScreen({neuralNetwork: network, player: true, bot: true});
    // const computingScreen = new ComputingScreen();
    const recordingScreen = new RecordingScreen({});
    const game = new Game(canvas, recordingScreen);
    game.start().catch(err => { console.error('Failed to start the game', err); });
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onLoad, false)
} else {
  onLoad()
}
