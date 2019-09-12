import { WIDTH, HEIGHT, MAX_VELOCITY, BLOCK_SIZE, FPS } from '../constants';
import { Toolbox } from '../game/toolbox';
import Vector from '../physics/vector';
import Box from '../physics/box';
import Tile from '../physics/tile';
import World from '../physics/world';
import Ship from '../ships/ship';
import PlayerShip from '../ships/player_ship';
import ScreenType from '../screens/screen_type';
import BackgroundScreen from '../screens/background_screen';
import { normal as N, standout as S, emphasis as E, TextFormatter, formatTime } from './text';

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

const fontSizePx: number = 24;

export default abstract class GameScreen<PlayerType extends PlayerShip> extends BackgroundScreen {
    protected camera: Camera;
    protected world: World;
    protected player: PlayerType;
    protected targetTime: number | undefined;

    public constructor(toolbox: Toolbox) {
        super(toolbox);
        const levelLength = this.getLevelLength();
        this.world = new World(levelLength);

        this.player = this.createPlayer();
        this.world.addShip(this.player);

        this.camera = new Camera(this.player, this.world.finishX);
    }

    protected abstract createPlayer(): PlayerType;
    protected abstract onLevelFinished(): ScreenType;
    protected getLevelLength(): number | undefined {
        return undefined;
    }

    protected update(): ScreenType | undefined {
        const sortedShips = this.world.update();
        this.render();

        if (sortedShips) {
            return this.onLevelFinished();
        } else {
            return undefined;
        }
    }

    private render(): void {
        this.clear();
        const { camera, world } = this;

        const screenLeft = camera.getScreenLeft();
        const screenRight = camera.getScreenRight();

        this.drawBackground(screenLeft);

        for (const box of world.getBoxes(screenLeft, screenRight)) {
            this.drawBox(box);
        }
        for (const ship of world.ships) {
            this.drawShip(ship);
        }
        this.drawHUD();
    }

    private drawMarkers(ship: Ship): void {
        const { toolbox, world, camera } = this;
        const { ctx } = toolbox;
        for (const sensors of world.sensors) {
            for (const sensor of sensors) {
                const markerPosition = sensor.getCurrentPosition(ship);
                const collides = world.getBox(markerPosition) !== undefined;
                ctx.fillStyle = collides ? 'red' : 'green';
                ctx.beginPath();
                ctx.arc(
                    camera.getScreenX(markerPosition.x),
                    camera.getScreenY(markerPosition.y),
                    2, 0, Math.PI * 2
                );
                ctx.fill();
            }
        }
    }

    private drawBox(box: Tile): void {
        const { toolbox, camera } = this;
        const { ctx, tilesImage } = toolbox;
        const { x, y } = camera.getScreenPosition(box);
        const { x: w, y: h } = box.size;
        ctx.drawImage(tilesImage, box.tile * w, 0, w, h, x, y, w, h);
    }

    private drawShip(ship: Ship): void {
        const { toolbox, camera } = this;
        const { ctx, shipImage } = toolbox;
        // TODO: visual differentiation
        // if (ship.touching) {
        // const intensity = ~~(255 * ship.velocity.getLength() / MAX_VELOCITY);
        const {x, y} = camera.getScreenPosition(ship);
        ctx.drawImage(shipImage, x, y);
        this.drawMarkers(ship);
        this.drawText(
            ship.name,
            12,
            camera.getScreenX(ship.position.x),
            camera.getScreenY(ship.top + 2),
            'center',
            ship.isThinking ? undefined : 'grey',
        );
    }

    protected drawHUD(): void {
        this.drawPlayerNames();
        this.drawTime();
    }

    private drawPlayerNames(): void {
        // RISKY - sort mutates data we don't own
        const { world } = this;
        const ships = world.ships.sort((aShip, bShip) => bShip.position.x - aShip.position.x);
        const page: [string, string][][] = ships.map(ship => {
            const initialOffset = BLOCK_SIZE + ship.halfWidth;
            const progression = (ship.position.x - initialOffset) / (this.world!.finishX - initialOffset) * 100;
            return [S(ship.name), N(' 🏁 '), S(progression.toFixed(0)), N('%')];
        })
        this.drawColoredTexts(page, fontSizePx, 4, 2, 0, 'left');
    }

    protected get totalSeconds(): number {
        return this.frames / FPS;
    }

    protected isTimeLimitExceeded(): boolean {
        if (this.targetTime === undefined) {
            return false;
        } else {
            return this.totalSeconds >= this.targetTime;
        }
    }

    private drawTime(): void {
        const texts = formatTime(this.totalSeconds, this.isTimeLimitExceeded() ? E : S);
        if (this.targetTime !== undefined) {
            texts.push(N('/'), ...formatTime(this.targetTime, N));
        }
        this.drawColoredText(
            texts,
            fontSizePx, WIDTH - 2, fontSizePx, 'right'
        );
    }
}
