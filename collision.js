export function areColliding(boxA, boxB) {
    return (
        boxA.left < boxB.right &&
        boxA.right > boxB.left &&
        boxA.bottom < boxB.top &&
        boxA.top > boxB.bottom
    );

    const maxXDiff = boxA.halfWidth + boxB.halfWidth;
    const xDiff = Math.abs(boxA.x - boxB.x);
    if (xDiff >= maxXDiff) {
        console.log('not colliding because X axis too far');
        return false;
    }
    const maxYDiff = boxA.halfHeight + boxB.halfHeight;
    const yDiff = Math.abs(boxA.y - boxB.y);
    if (yDiff >= maxYDiff) {
        console.log('not colliding because Y axis too far');
        return false;
    }

    const points = [boxB.topLeft, boxB.topRight, boxB.bottomLeft, boxB.bottomRight];
    console.log('collision points', points);
    return points.some(point => boxA.contains(point));
}
