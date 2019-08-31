import { WIDTH, HEIGHT, MAX_VELOCITY } from './constants';
import Vector from './vector';
import Box from './box';
import World from './world';
import Ship from './ship';

const PLAYER_X_AT = 1 / 3;

class Camera {
    public trackedShip: Box;
    private levelLength: number;

    public constructor(trackedShip: Box, levelLength: number) {
        this.trackedShip = trackedShip;
        this.levelLength = levelLength;
    }

    public getScreenX(physicsX: number): number {
        return PLAYER_X_AT * WIDTH + physicsX - this.trackedShip.position.x;
    }

    public getScreenY(physicsY: number): number {
        return HEIGHT - physicsY;
    }

    public getScreenPosition(box: Box): Vector {
        const {left, top} = box;
        return new Vector(
            this.getScreenX(left),
            this.getScreenY(top)
        );
    }

    public getScreenLeft(): number {
        return this.trackedShip.position.x - PLAYER_X_AT * WIDTH;
    }

    public getScreenRight(): number {
        return this.trackedShip.position.x + (1 - PLAYER_X_AT) * WIDTH;
    }
}

export default class Renderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private camera: Camera;

    public constructor(canvas: HTMLCanvasElement, trackedShip: Box, levelLength: number) {
        this.canvas = canvas;
        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Canvas context not initialized');
        }
        this.ctx = ctx;
        this.camera = new Camera(trackedShip, levelLength);
    }

    public start(): void {
        this.canvas.width = WIDTH;
        this.canvas.height = HEIGHT;
    }

    public render(world: World): void {
        this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
        const screenLeft = this.camera.getScreenLeft();
        const screenRight = this.camera.getScreenRight();
        for (const box of world.getBoxes(screenLeft, screenRight)) {
            this.drawBox(box, '#0000ff');
        }
        for (const ship of world.ships) {
            const intensity = ~~(255 * ship.velocity.length() / MAX_VELOCITY);
            let r = 0, g = 0, b = intensity;
            if (ship.touching) {
                r = 255;
            } else {
                g = 255;
            }
            this.drawBox(ship, `rgb(${r}, ${g}, ${b}`);
            this.drawMarkers(ship, world);
        }
    }

    private drawMarkers(ship: Ship, world: World): void {
        for (const sensors of world.sensors) {
            for (const sensor of sensors) {
                const markerPosition = sensor.getCurrentPosition(ship);
                const collides = world.getBox(markerPosition) !== undefined;
                this.ctx.fillStyle = collides ? 'red' : 'green';
                this.ctx.beginPath();
                this.ctx.arc(this.camera.getScreenX(markerPosition.x), this.camera.getScreenY(markerPosition.y), 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
    }

    private drawBox(box: Box, color: string): void {
        this.ctx.fillStyle = color;
        const {x, y} = this.camera.getScreenPosition(box);
        const {x: w, y: h} = box.size;
        this.ctx.fillRect(x, y, w, h);
    }
}
