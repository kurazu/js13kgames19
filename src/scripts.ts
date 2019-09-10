import { FeedForwardNetwork } from './math/net';
import Game from './game/game';
import GameScreen from './screens/game_screen';
import ComputingScreen from './screens/computing_screen';
import RecordingScreen from './screens/recording_screen';
import TitleScreen from './screens/title_screen';

function onLoad(): void {
    const canvas = document.querySelector<HTMLCanvasElement>('canvas')!;
    const recordingScreen = new RecordingScreen({});
    const computingScreen = new ComputingScreen();
    const titleScreen = new TitleScreen();
    const game = new Game(canvas, titleScreen);
    game.start().catch(err => { console.error('Failed to start the game', err); });
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onLoad, false)
} else {
  onLoad()
}
