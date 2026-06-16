import CreatureGenerator from "./classes/CreatureGenerator.js";

const interval = 1000 / 60;

let grabbing = false;
let lastMouseX = 0;
let lastMouseY = 0;

const main = document.querySelector("main");

const creatures = [
    CreatureGenerator.generateCreature(2),
    CreatureGenerator.generateCreature(3),
    CreatureGenerator.generateCreature(4),
    CreatureGenerator.generateCreature(5),
    CreatureGenerator.generateCreature(6),
    CreatureGenerator.generateCreature(7)
];

function update() {
    creatures.forEach(creature => creature.update())
}

function draw() {
    creatures.forEach(creature => creature.draw())
}

setInterval(() => {
    update();
    draw();
}, interval);

document.addEventListener("mousedown", () => {
    grabbing = true;
    document.body.style.cursor = "grabbing";
});

document.addEventListener("mouseup", () => {
    grabbing = false;
    document.body.style.cursor = "grab";
});

document.addEventListener("mousemove", (event) => {
    const oldLastMouseX = lastMouseX;
    const oldLastMouseY = lastMouseY;

    lastMouseX = event.clientX;
    lastMouseY = event.clientY;

    if (!grabbing || oldLastMouseX === 0 || oldLastMouseY === 0) return;

    const dx = event.clientX - oldLastMouseX;
    const dy = event.clientY - oldLastMouseY;

    let left = parseFloat(main.style.left) || 0;
    let top = parseFloat(main.style.top) || 0;


    main.style.left = `${left + dx}px`;
    main.style.top = `${top + dy}px`;
});