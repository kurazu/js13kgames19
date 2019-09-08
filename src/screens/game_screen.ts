import { WIDTH, HEIGHT, MAX_VELOCITY } from '../constants';
import Vector from '../physics/vector';
import Box from '../physics/box';
import World from '../physics/world';
import Ship from '../ships/ship';
import PlayerShip from '../ships/player_ship';
import { loadImage } from '../game/resources';
import Screen from '../screens/screen';
import Keyboard from '../game/keyboard';
import Topic from '../observable';
import WorkerCommunicator from '../worker_communication';

const PLAYER_X_AT = 1 / 3;

class Camera {
    public trackedShip: Box;
    private finishX: number;

    public constructor(trackedShip: Box, finishX: number) {
        this.trackedShip = trackedShip;
        this.finishX = finishX;
    }

    public getScreenX(physicsX: number): number {
        return ~~(physicsX - Math.min(Math.max(this.trackedShip.position.x - PLAYER_X_AT * WIDTH, 0), this.finishX - WIDTH));
    }

    public getScreenY(physicsY: number): number {
        return ~~(HEIGHT - physicsY);
    }

    public getScreenPosition(box: Box): Vector {
        const {left, top} = box;
        return new Vector(
            this.getScreenX(left),
            this.getScreenY(top)
        );
    }

    public getScreenLeft(): number {
        return ~~Math.min(Math.max(this.trackedShip.position.x - PLAYER_X_AT * WIDTH, 0), this.finishX - WIDTH);
    }

    public getScreenRight(): number {
        return this.getScreenLeft() + WIDTH;
    }
}

export default abstract class GameScreen<Options, PlayerType extends PlayerShip> extends Screen<Options> {
    protected shipImage: HTMLImageElement | undefined;
    protected camera: Camera | undefined;
    protected world: World | undefined;
    protected player: PlayerType | undefined;
    protected levelLength: number | undefined = undefined;

    public async load(keyboard: Keyboard, workerCommunicator: WorkerCommunicator): Promise<void> {
        this.shipImage = await loadImage('img/ship.png');
        this.world = new World(this.levelLength);

        this.player = this.createPlayer(keyboard);
        this.world.addShip(this.player);

        this.camera = new Camera(this.player, this.world.finishX);
    }

    protected abstract createPlayer(keyboard: Keyboard): PlayerType;
    protected abstract getNextScreen(workerCommunicator: WorkerCommunicator): Screen<any>;

    public update(ctx: CanvasRenderingContext2D, workerCommunicator: WorkerCommunicator): Screen<any> | undefined {
        const sortedShips = this.world!.update();
        this.render(ctx);

        if (sortedShips) {
            return this.getNextScreen(workerCommunicator);
        } else {
            return undefined;
        }
    }

    private render(ctx: CanvasRenderingContext2D): void {
        this.clear(ctx);
        const screenLeft = this.camera!.getScreenLeft();
        const screenRight = this.camera!.getScreenRight();
        for (const box of this.world!.getBoxes(screenLeft, screenRight)) {
            this.drawBox(ctx, box, '#0000ff');
        }
        for (const ship of this.world!.ships) {
            this.drawShip(ctx, ship);
        }
    }

    private drawMarkers(ctx: CanvasRenderingContext2D, ship: Ship): void {
        for (const sensors of this.world!.sensors) {
            for (const sensor of sensors) {
                const markerPosition = sensor.getCurrentPosition(ship);
                const collides = this.world!.getBox(markerPosition) !== undefined;
                ctx.fillStyle = collides ? 'red' : 'green';
                ctx.beginPath();
                ctx.arc(this.camera!.getScreenX(markerPosition.x), this.camera!.getScreenY(markerPosition.y), 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    private drawBox(ctx: CanvasRenderingContext2D, box: Box, color: string): void {
        ctx.fillStyle = color;
        const {x, y} = this.camera!.getScreenPosition(box);
        const {x: w, y: h} = box.size;
        ctx.fillRect(x, y, w, h);
    }

    private drawShip(ctx: CanvasRenderingContext2D, ship: Ship): void {
        const intensity = ~~(255 * ship.velocity.getLength() / MAX_VELOCITY);
        let r = 0, g = 0, b = intensity;
        if (ship.touching) {
            r = 255;
        } else {
            g = 255;
        }
        const color = `rgb(${r}, ${g}, ${b})`;
        this.drawBox(ctx, ship, color);
        const {x, y} = this.camera!.getScreenPosition(ship);
        ctx.drawImage(this.shipImage!, x, y);
        // this.drawMarkers(ctx, ship);
        this.drawText(
            ctx,
            ship.name,
            ship.isThinking ? 'white' : 'grey',
            'black',
            this.camera!.getScreenX(ship.position.x),
            this.camera!.getScreenY(ship.top + 2)
        );
    }

    private drawText(ctx: CanvasRenderingContext2D, text: string, textColor: string, bgColor: string, x: number, y: number): void{
        ctx.font = `8px monospace`;
        ctx.textAlign = "center";
        ctx.fillStyle = bgColor;
        const range = [-1, 0, 1];
        for (const xDiff of range) {
            for (const yDiff of range) {
                ctx.fillText(text, x - xDiff, y - yDiff);
            }
        }
        ctx.fillStyle = textColor;
        ctx.fillText(text, x, y);
    }
}
