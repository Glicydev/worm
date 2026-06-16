import CreatureGenerator from "./classes/CreatureGenerator.js";
import VectorMath from "./classes/VectorMath.js";

const interval = 1000 / 60;
let secondsInWave = 2;
let time = 0;

let grabbing = false;
let lastMouseX = 0;
let lastMouseY = 0;

const main = document.querySelector("main");
const teleportBar = document.getElementById("worm-teleport-bar");
let teleportAnimationTimeout = null;

let creatures = [
    CreatureGenerator.generateCreature(),
    CreatureGenerator.generateCreature(),
    CreatureGenerator.generateCreature(),
    CreatureGenerator.generateCreature(),
    CreatureGenerator.generateCreature(),
    CreatureGenerator.generateCreature(),
    CreatureGenerator.generateCreature(),
    CreatureGenerator.generateCreature(),
    CreatureGenerator.generateCreature(),
    CreatureGenerator.generateCreature(),
    CreatureGenerator.generateCreature(),
    CreatureGenerator.generateCreature(),
    CreatureGenerator.generateCreature(),
    CreatureGenerator.generateCreature(),
    CreatureGenerator.generateCreature(),
    CreatureGenerator.generateCreature(),
    CreatureGenerator.generateCreature()
];

let selectedCreatureID = null;

function focusCreature(id) {
    const creature = creatures.find(c => c.id === id);
    if (!creature) return;

    const head = creature.articulations[0];
    const targetLeft = window.innerWidth / 2 - head.x;
    const targetTop = window.innerHeight / 2 - head.y;

    main.style.transition = "left 360ms cubic-bezier(0.22, 0.61, 0.36, 1), top 360ms cubic-bezier(0.22, 0.61, 0.36, 1)";
    main.style.left = `${targetLeft}px`;
    main.style.top = `${targetTop}px`;

    if (teleportAnimationTimeout) {
        clearTimeout(teleportAnimationTimeout);
    }

    teleportAnimationTimeout = setTimeout(() => {
        main.style.transition = "none";
    }, 380);

    selectedCreatureID = id;
    renderTeleportButtons();
}

function renderTeleportButtons() {
    if (!teleportBar) return;

    teleportBar.innerHTML = "";

    creatures.forEach((creature) => {
        const id = creature.id;

        const button = document.createElement("button");
        button.textContent = `Ver ${id}`;
        button.title = `Téléporter la caméra vers le ver ${id}`;
        button.setAttribute("aria-label", `Téléporter vers le ver ${id}`);

        if (selectedCreatureID === id) {
            button.classList.add("active");
        }

        button.addEventListener("click", () => focusCreature(id));
        teleportBar.appendChild(button);
    });
}

renderTeleportButtons();

function update() {
    time += interval / 1000;

    if (time >= secondsInWave) {
        waveEnd();
    }

    creatures.forEach(creature => creature.update())
}

function draw() {
    creatures.forEach(creature => creature.draw())
}

function waveEnd() {
    time = 0;
    CreatureGenerator.resetId(5);
    const sortedCreatures = creatures.sort((a, b) => {
        const aDistance = VectorMath.distance(a.articulations[0], a.startPosition);
        const bDistance = VectorMath.distance(b.articulations[0], b.startPosition);

        a.clear();
        b.clear();

        return bDistance - aDistance;
    });

    const bestCreatures = sortedCreatures.slice(0, 4);
    const wrostCreatures = sortedCreatures.slice(4);

    bestCreatures.forEach(creature => creature.reset());

    const newCreatures = wrostCreatures.map(creature => CreatureGenerator.generateCreature(creature.id));

    creatures = [
        ...bestCreatures,
        ...newCreatures
    ].sort((a, b) => a.id - b.id);

    renderTeleportButtons();
}

setInterval(() => {
    update();
    draw();
}, interval);

document.addEventListener("mousedown", (event) => {
    if (teleportBar && teleportBar.contains(event.target)) return;

    main.style.transition = "none";

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

// Scroll
let scroll = 1000;

const scrollIndication = document.getElementById("scrollIndication");

window.addEventListener("wheel", (event) => {
    if (teleportBar && teleportBar.contains(event.target)) return;

    event.preventDefault();

    scroll -= event.deltaY;
    scroll = Math.max(100, scroll);

    main.style.transform = `scale(${scroll / 1000})`;

    scrollIndication.textContent = `Zoom : ${Math.round((scroll / 1000) * 100)}%`;
});