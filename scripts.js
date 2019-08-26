const WIDTH = 640 / 2;
const HEIGH = 480 / 2;

function onLoad() {
    const canvas = document.getElementById('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGH;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, WIDTH / 2, HEIGH / 2);
    ctx.fillStyle = '#0000ff';
    ctx.fillRect(WIDTH / 2, HEIGH / 2, WIDTH / 2, HEIGH / 2);
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onLoad, false)
} else {
  onLoad()
}
