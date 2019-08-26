import Box from './box';
import Vector from './vector';
import { areColliding } from './collision';

const WIDTH = 640 / 2;
const HEIGHT = 480 / 2;

const COLORS = ['#ff0000', '#0000ff', '#ffff00', '#00ff00'];
let colorIdx = 0;

function getColor() {
    return COLORS[~~(colorIdx++ / 15) % COLORS.length];
}

function drawBox(ctx, box, color) {
    ctx.fillStyle = color;
    ctx.fillRect(box.left, HEIGHT - box.top, box.size.x, box.size.y);
}

const staticBox = new Box(new Vector(100, 100), new Vector(50, 50));
const flyingBox = new Box(new Vector(100, 100), new Vector(150, 100));

function gameLoop() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    drawBox(ctx, staticBox, '#0000ff');
    drawBox(ctx, flyingBox, areColliding(staticBox, flyingBox) ? '#ff0000' : '#00ff00');

    console.log(flyingBox.position.x, flyingBox.position.y, flyingBox.left, flyingBox.right, flyingBox.top, flyingBox.bottom);

    requestAnimationFrame(gameLoop);
}

const INCREMENT = 10;
function onKeyPress (evt) {
    const key = event.key || event.keyCode;
    console.log('KEY', key);
    if (key === 'ArrowRight') {
        flyingBox.position.x += INCREMENT;
    } else if (key === 'ArrowLeft') {
        flyingBox.position.x -= INCREMENT;
    } else if (key === 'ArrowUp') {
        flyingBox.position.y += INCREMENT;
    } else if (key === 'ArrowDown') {
        flyingBox.position.y -= INCREMENT;
    } else {
        return;
    }
    evt.preventDefault();
}

function onLoad() {
    const canvas = document.getElementById('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    document.addEventListener('keyup', onKeyPress);

    requestAnimationFrame(gameLoop);
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onLoad, false)
} else {
  onLoad()
}
