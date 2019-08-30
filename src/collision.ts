import Box from './box';

export function areColliding(boxA: Box, boxB: Box): boolean {
    return (
        boxA.left < boxB.right &&
        boxA.right > boxB.left &&
        boxA.bottom < boxB.top &&
        boxA.top > boxB.bottom
    );
}
