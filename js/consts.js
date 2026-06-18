export let friction = 1; // 0-1
export let moveFactor = 50; // 0-100

export function setFriction(value) {
    friction = Number(value);
}

export function setMoveFactor(value) {
    moveFactor = Number(value);
}