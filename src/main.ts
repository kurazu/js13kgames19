import start from './game/game';
import ScreenType from './screens/screen_type';

function onLoad(): void {
    const canvas = document.querySelector<HTMLCanvasElement>('canvas')!;
    start(canvas, ScreenType.TITLE).catch(err => { console.error('Failed to start the game', err); });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onLoad, false)
} else {
  onLoad()
}
