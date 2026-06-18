import CreatureGenerator from "./classes/CreatureGenerator.js";
import { friction, moveFactor, setFriction, setMoveFactor } from "./consts.js";

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
const controlPanel = document.getElementById("worm-control-panel");
const panelTabs = document.querySelectorAll("[data-panel-tab]");
const panelSections = document.querySelectorAll("[data-panel-section]");
const waveNumber = document.getElementById("worm-wave-number");
const waveTime = document.getElementById("worm-wave-time");
const waveBarFill = document.getElementById("worm-wave-bar-fill");
const waveBar = document.querySelector(".wave-bar");
const leaderboardList = document.getElementById("worm-leaderboard-list");
const teleportBar = document.getElementById("worm-teleport-bar");
const settingsFriction = document.getElementById("settings-friction");
const settingsMoveFactor = document.getElementById("settings-move-factor");
const settingsFrictionValue = document.getElementById("settings-friction-value");
const settingsMoveFactorValue = document.getElementById("settings-move-factor-value");
const scrollIndication = document.getElementById("scrollIndication");

let teleportAnimationTimeout = null;
let currentWave = 1;

let creatures = new Array(numberOfWorms).fill().map(() => CreatureGenerator.generateCreature());
let selectedCreatureID = creatures[0].id || null;

function setActivePanel(panelName) {
    panelTabs.forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.panelTab === panelName);
    });

    panelSections.forEach((section) => {
        section.classList.toggle("active", section.dataset.panelSection === panelName);
    });
}

panelTabs.forEach((tab) => {
    tab.addEventListener("click", () => setActivePanel(tab.dataset.panelTab));
});

function getSelectedCreature() {
    return creatures.find(creature => creature.id === selectedCreatureID) || creatures[0] || null;
}

function renderSettingsValues() {
    if (settingsFrictionValue) {
        settingsFrictionValue.textContent = friction.toFixed(2);
    }

    if (settingsMoveFactorValue) {
        settingsMoveFactorValue.textContent = `${moveFactor}`;
    }
}

function renderWaveHud() {
    const progress = Math.min(1, time / secondsInWave);
    const elapsedSeconds = time.toFixed(1);
    const remainingSeconds = Math.max(0, secondsInWave - time).toFixed(1);

    if (waveNumber) {
        waveNumber.textContent = `${currentWave}`;
    }

    if (waveTime) {
        waveTime.textContent = `${elapsedSeconds}s / ${secondsInWave.toFixed(1)}s`;
        waveTime.title = `${remainingSeconds}s restants`;
    }

    if (waveBarFill) {
        waveBarFill.style.width = `${progress * 100}%`;
    }

    if (waveBar) {
        waveBar.setAttribute("aria-valuenow", `${Math.round(progress * 100)}`);
        waveBar.setAttribute("aria-valuetext", `${Math.round(progress * 100)}%`);
    }
}

function renderTeleportButtons() {
    if (!teleportBar) return;

    teleportBar.innerHTML = "";

    creatures.forEach((creature) => {
        const button = document.createElement("button");
        button.textContent = `Ver ${creature.id}`;
        button.title = `Téléporter la caméra vers le ver ${creature.id}`;
        button.setAttribute("aria-label", `Téléporter vers le ver ${creature.id}`);

        if (selectedCreatureID === creature.id) {
            button.classList.add("active");
        }

        button.addEventListener("click", () => focusCreature(creature.id));
        teleportBar.appendChild(button);
    });
}

function renderLeaderboard() {
    if (!leaderboardList) return;

    leaderboardList.innerHTML = "";

    const rankedCreatures = [...creatures]
        .sort((a, b) => b.getScore() - a.getScore())
        .slice(0, 5);

    rankedCreatures.forEach((creature, index) => {
        const row = document.createElement("button");
        row.type = "button";
        row.className = "leaderboard-row";

        if (creature.id === selectedCreatureID) {
            row.classList.add("active");
        }

        row.innerHTML = `
            <span class="leaderboard-rank">#${index + 1}</span>
            <span class="leaderboard-name">Ver ${creature.id}</span>
            <strong class="leaderboard-score">${Math.round(creature.getScore() / 1000)}</strong>
        `;

        row.addEventListener("click", () => focusCreature(creature.id));
        leaderboardList.appendChild(row);
    });
}

function renderControlPanel() {
    renderSettingsValues();
    renderTeleportButtons();
    renderLeaderboard();
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
    renderControlPanel();
}

if (settingsFriction) {
    settingsFriction.value = `${friction}`;
    settingsFriction.addEventListener("input", (event) => {
        setFriction(event.target.value);
        renderSettingsValues();
    });
}

if (settingsMoveFactor) {
    settingsMoveFactor.value = `${moveFactor}`;
    settingsMoveFactor.addEventListener("input", (event) => {
        setMoveFactor(event.target.value);
        renderSettingsValues();
    });
}

renderControlPanel();
setActivePanel("settings");
renderWaveHud();

function update() {
    time += interval / 1000;

    if (time >= secondsInWave) {
        waveEnd();
    }

    creatures.forEach(creature => creature.update());
    renderLeaderboard();
    renderWaveHud();
}

function draw() {
    creatures.forEach(creature => creature.draw());
}

function waveEnd() {
    time = 0;
    currentWave += 1;
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
    renderControlPanel();
    renderWaveHud();
}

setInterval(() => {
    update();
    draw();
}, interval);

document.addEventListener("mousedown", (event) => {
    if ((controlPanel && controlPanel.contains(event.target)) || (leaderboardList && leaderboardList.contains(event.target))) return;

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

    const left = parseFloat(main.style.left) || 0;
    const top = parseFloat(main.style.top) || 0;

    main.style.left = `${left + dx}px`;
    main.style.top = `${top + dy}px`;
});

let scroll = 1000;

window.addEventListener("wheel", (event) => {
    scroll -= event.deltaY;
    scroll = Math.max(100, scroll);

    main.style.transform = `scale(${scroll / 1000})`;

    if (scrollIndication) {
        scrollIndication.textContent = `Zoom : ${Math.round((scroll / 1000) * 100)}%`;
    }
});