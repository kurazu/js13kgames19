import { WIDTH, HEIGHT, MAX_VELOCITY, BLOCK_SIZE } from '../constants';
import Vector from '../physics/vector';
import Box from '../physics/box';
import Tile from '../physics/tile';
import World from '../physics/world';
import Ship from '../ships/ship';
import PlayerShip from '../ships/player_ship';
import Screen from '../screens/screen';
import BackgroundScreen from '../screens/background_screen';
import { Toolbox } from '../game/toolbox';

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

export default abstract class GameScreen<Options, PlayerType extends PlayerShip> extends BackgroundScreen<Options> {
    protected camera: Camera | undefined;
    protected world: World | undefined;
    protected player: PlayerType | undefined;
    protected levelLength: number | undefined = undefined;

    public init(toolbox: Toolbox): void {
        this.world = new World(this.levelLength);

        this.player = this.createPlayer(toolbox);
        this.world.addShip(this.player);

        this.camera = new Camera(this.player, this.world.finishX);
    }

    protected abstract createPlayer(toolbox: Toolbox): PlayerType;
    protected abstract getNextScreen(toolbox: Toolbox): Screen<any>;

    public update(toolbox: Toolbox): Screen<any> | undefined {
        const sortedShips = this.world!.update();
        this.render(toolbox);

        if (sortedShips) {
            return this.getNextScreen(toolbox);
        } else {
            return undefined;
        }
    }

    private render(toolbox: Toolbox): void {
        this.clear(toolbox);
        const camera = this.camera!;

        const screenLeft = camera.getScreenLeft();
        const screenRight = camera.getScreenRight();

        this.drawBackground(toolbox, screenLeft);

        const world = this.world!;
        for (const box of world.getBoxes(screenLeft, screenRight)) {
            this.drawBox(toolbox, box);
        }
        for (const ship of world.ships) {
            this.drawShip(toolbox, ship);
        }
        this.drawHUD(toolbox);
    }

    private drawMarkers(toolbox: Toolbox, ship: Ship): void {
        const { ctx } = toolbox;
        const world = this.world!;
        const camera = this.camera!;
        for (const sensors of world.sensors) {
            for (const sensor of sensors) {
                const markerPosition = sensor.getCurrentPosition(ship);
                const collides = world.getBox(markerPosition) !== undefined;
                ctx.fillStyle = collides ? 'red' : 'green';
                ctx.beginPath();
                ctx.arc(
                    camera.getScreenX(markerPosition.x),
                    camera!.getScreenY(markerPosition.y),
                    2, 0, Math.PI * 2
                );
                ctx.fill();
            }
        }
    }

    private drawBox(toolbox: Toolbox, box: Tile): void {
        const { ctx } = toolbox;
        const {x, y} = this.camera!.getScreenPosition(box);
        const {x: w, y: h} = box.size;
        ctx.drawImage(toolbox.tilesImage, box.tile * w, 0, w, h, x, y, w, h);
    }

    private drawShip(toolbox: Toolbox, ship: Ship): void {
        const { ctx } = toolbox;
        const camera = this.camera!;
        // TODO: visual differentiation
        // if (ship.touching) {
        // const intensity = ~~(255 * ship.velocity.getLength() / MAX_VELOCITY);
        const {x, y} = camera.getScreenPosition(ship);
        ctx.drawImage(toolbox.shipImage, x, y);
        this.drawMarkers(toolbox, ship);
        this.drawText(
            toolbox,
            ship.name,
            12,
            camera.getScreenX(ship.position.x),
            camera.getScreenY(ship.top + 2),
            'center',
            ship.isThinking ? undefined : 'grey',
        );
    }

    private drawHUD(toolbox: Toolbox): void {
        // RISKY - sort mutates data we don't own
        const PADDING = 4;
        const FONT_SIZE = 16;
        const ships = this.world!.ships.sort((aShip, bShip) => bShip.position.x - aShip.position.x);
        for (const [idx, ship] of ships.entries()) {
            const initialOffset = BLOCK_SIZE + ship.halfWidth;
            const progression = (ship.position.x - initialOffset) / (this.world!.finishX - initialOffset) * 100;
            const text = `🏁 ${ship.name} ${progression.toFixed(0)}%`;
            this.drawText(toolbox, text, FONT_SIZE, PADDING, (FONT_SIZE + PADDING) * (idx + 1));
        }
    }
}
