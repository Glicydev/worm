export default class VectorMath {
    static distance(pointA, pointB) {
        const dx = pointB.x - pointA.x;
        const dy = pointB.y - pointA.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    static degreeToRadian(degree) {
        return degree * (Math.PI / 180);
    }

    static radianToDegree(radian) {
        return radian * (180 / Math.PI);
    }

    static angleBetweenFromHorizontal(pointA, pointB) {
        const dx = pointB.x - pointA.x;
        const dy = pointB.y - pointA.y;
        return VectorMath.radianToDegree(Math.atan2(dy, dx));
    }

    static getWay(angleA, angleB) {
        return angleB > angleA ? -1 : 1;
    }

    static randomAngle() {
        return Math.random() * 360;
    }
}