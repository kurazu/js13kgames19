const WIDTH = 640 / 2;
const HEIGH = 480 / 2;

const COLORS = ['#ff0000', '#0000ff', '#ffff00', '#00ff00'];
let colorIdx = 0;

function getColor() {
    return COLORS[~~(colorIdx++ / 15) % COLORS.length];
}

function gameLoop() {
    const canvas = document.getElementById('canvas');

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, WIDTH, HEIGH);
    ctx.fillStyle = getColor();
    ctx.fillRect(0, 0, WIDTH / 2, HEIGH / 2);
    ctx.fillStyle = getColor();
    ctx.fillRect(WIDTH / 2, HEIGH / 2, WIDTH / 2, HEIGH / 2);

    requestAnimationFrame(gameLoop);
}

function onLoad() {
    const canvas = document.getElementById('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGH;

    requestAnimationFrame(gameLoop);
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onLoad, false)
} else {
  onLoad()
}
