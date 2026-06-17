import CreatureGenerator from "./classes/CreatureGenerator.js";
import VectorMath from "./classes/VectorMath.js";

const interval = 1000 / 70;
let secondsInWave = 5;
let time = 0;

const numberOfWorms = 30;
const numberOfBestWorms = 10;
const diversity = 0.7;

let grabbing = false;
let lastMouseX = 0;
let lastMouseY = 0;

const main = document.querySelector("main");
const teleportBar = document.getElementById("worm-teleport-bar");
const statsId = document.getElementById("worm-stats-id");
const statsDistance = document.getElementById("worm-stats-distance");
const statsEnergy = document.getElementById("worm-stats-energy");
const statsScore = document.getElementById("worm-stats-score");
let teleportAnimationTimeout = null;

let creatures = new Array(numberOfWorms).fill().map(() => CreatureGenerator.generateCreature());

let selectedCreatureID = creatures[0].id || null;

function getSelectedCreature() {
    return creatures.find(creature => creature.id === selectedCreatureID) || creatures[0] || null;
}

function renderStatsPanel() {
    const creature = getSelectedCreature();

    if (!creature || !statsId || !statsDistance || !statsEnergy || !statsScore) return;

    const distance = VectorMath.distance(creature.articulations[0], creature.startPosition);

    statsId.textContent = `Ver ${creature.id}`;
    statsDistance.textContent = `${distance.toFixed(0)}`;
    statsEnergy.textContent = `${Math.round(creature.spentEnergy / 1000)}`;
    statsScore.textContent = `${Math.round(creature.getScore() / 10e3)}`;
}

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
    renderStatsPanel();
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
renderStatsPanel();

function update() {
    time += interval / 1000;

    if (time >= secondsInWave) {
        waveEnd();
    }

    creatures.forEach(creature => creature.update())
    renderStatsPanel();
}

function draw() {
    creatures.forEach(creature => creature.draw())
}

function waveEnd() {
    time = 0;
    CreatureGenerator.resetId(5);
    const sortedCreatures = creatures.sort((a, b) => {
        const aScore = a.getScore();
        const bScore = b.getScore();

        a.clear();
        b.clear();

        return bScore - aScore;
    });

    const bestCreatures = sortedCreatures.slice(0, numberOfBestWorms - 1);

    creatures.forEach(creature => creature.reset());

    const availableIds = creatures
        .map(creature => creature.id)
        .filter(id => !bestCreatures.some(bestCreature => bestCreature.id === id));

    const numberOfNewCreatures = numberOfWorms - bestCreatures.length;
    const newCreatures = Array.from({ length: numberOfNewCreatures * (1 - diversity) }, (_, index) => {
        const parent = bestCreatures[index % bestCreatures.length];
        return parent.mutate(availableIds[index]);
    });

    for (let i = newCreatures.length; i < numberOfNewCreatures; i++) {
        newCreatures.push(CreatureGenerator.generateCreature(availableIds[i]));
    }

    creatures = [
        ...bestCreatures,
        ...newCreatures
    ].sort((a, b) => a.id - b.id);

    selectedCreatureID = creatures[0].id || null;

    renderTeleportButtons();
    renderStatsPanel();
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
    scroll -= event.deltaY;
    scroll = Math.max(100, scroll);

    main.style.transform = `scale(${scroll / 1000})`;

    scrollIndication.textContent = `Zoom : ${Math.round((scroll / 1000) * 100)}%`;
});