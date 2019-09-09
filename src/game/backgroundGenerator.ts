import { WIDTH, HEIGHT } from '../constants';
import { randomSample } from '../utils';

// const ALPHA = Uint8ClampedArray.from([0xff, 0xff, 0xff, 0x00]);
const GREEN = Uint8ClampedArray.from([0x6d, 0xa4, 0x1a, 0xff]);
const BLUE = Uint8ClampedArray.from([0xc0, 0xe8, 0xec, 0xff]);

async function generateSine(
    periods: number, amplitude: number,
    bottom: number, color: Uint8ClampedArray,
    markers: number, markerHeight: number, markerWidth: number
): Promise<CanvasImageSource> {

    function value(column: number): number {
        const normalizedSin = Math.sin(column / WIDTH * (Math.PI * 2) * periods) / 2 + 0.5;
        return normalizedSin * amplitude + bottom;
    }

    const result = new ImageData(WIDTH, HEIGHT);
    const pixelData: Uint8ClampedArray = result.data;

    function colorPixel(row: number, column: number): void {
        pixelData.set(color, ((HEIGHT - row - 1) * WIDTH + column) * 4);
    }

    for (let column = 0; column < WIDTH; column++) {
        for (let row = 0; row < HEIGHT; row++) {
            const normalizedSin = Math.sin(column / WIDTH * (Math.PI * 2) * periods) / 2 + 0.5;
            if (value(column) > row) {
                colorPixel(row, column);
            }
        }
    }

    const markerPositions = randomSample(WIDTH - markerWidth * 2, markers).map(n => n + markerWidth);
    for (const column of markerPositions) {
        const row = ~~value(column);
        const halfMarkerWidth = ~~(markerWidth / 2);
        for (let r = -markerHeight; r < markerHeight; r++) {
            for (let c = -halfMarkerWidth; c < halfMarkerWidth; c++) {
                colorPixel(row + r, column + c);
            }
        }
        const halfMarkerWidthSquared = halfMarkerWidth * halfMarkerWidth;
        for (let r = 0; r < halfMarkerWidth; r++) {
            for (let c = -halfMarkerWidth; c < halfMarkerWidth; c++) {
                if (r * r + c * c < halfMarkerWidthSquared) {
                    colorPixel(row + markerHeight + r, column + c);
                }
            }
        }
    }

    return createImageBitmap(result);
}

export async function generateForeground(): Promise<CanvasImageSource> {
    return generateSine(3, 100, 200, GREEN, 5, 50, 28);
}

export async function generateBackground(): Promise<CanvasImageSource> {
    return generateSine(4, 50, 400, BLUE, 3, 26, 16);
}
