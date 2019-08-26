export function areColliding(boxA, boxB) {
    return (
        boxA.left < boxB.right &&
        boxA.right > boxB.left &&
        boxA.bottom < boxB.top &&
        boxA.top > boxB.bottom
    );
}
