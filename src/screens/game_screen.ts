import { WIDTH, HEIGHT, MAX_VELOCITY } from '../constants';
import Vector from '../physics/vector';
import Box from '../physics/box';
import World from '../physics/world';
import Ship from '../ships/ship';
import PlayerShip from '../ships/player_ship';
import AIShip from '../ships/ai_ship';
import { loadImage } from '../game/resources';
import { FeedForwardNetwork } from '../math/net';
import Screen from '../screens/screen';
import Keyboard from '../game/keyboard';

interface GameScreenOptions {
    neuralNetwork: FeedForwardNetwork,
    player: boolean,
    bot: boolean
}

const PLAYER_X_AT = 1 / 3;

class Camera {
    public trackedShip: Box;

    public constructor(trackedShip: Box) {
        this.trackedShip = trackedShip;
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

export default class GameScreen extends Screen<GameScreenOptions> {
    private shipImage: HTMLImageElement | undefined;
    private camera: Camera | undefined;
    private world: World | undefined;

    public async load(keyboard: Keyboard): Promise<void> {
        this.shipImage = await loadImage('img/ship.png');
        this.world = new World();

        if (this.options.player) {
            this.world.addShip(new PlayerShip(keyboard));
        }
        if (this.options.bot) {
            this.world.addShip(new AIShip(this.options.neuralNetwork));
        }

        const [firstPlayer] = this.world.ships;
        this.camera = new Camera(firstPlayer);
    }

    public update(ctx: CanvasRenderingContext2D): Screen<any> | undefined {
        const sortedShips = this.world!.update();
        this.render(ctx);

        if (sortedShips) {
            return new GameScreen(this.options);
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
            this.drawMarkers(ctx, ship);
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

    private drawShip(ctx: CanvasRenderingContext2D, ship: Ship) {
        const intensity = ~~(255 * ship.velocity.length() / MAX_VELOCITY);
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
    }
}
