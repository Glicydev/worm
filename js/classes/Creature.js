export default class Creature {
    constructor(id, articulations, members) {
        this.articulations = articulations;
        this.members = members;
        this.id = id;

        this.startPosition = {
            x: articulations[0].x,
            y: articulations[0].y
        };
    }

    draw() {
        this.articulations.forEach(articulation => articulation.render());

        this.members.forEach(member => member.render());

        const nameP = document.createElement("p");
        nameP.className = "creature-name";
        nameP.id = `creature-name-${this.id}`;
        nameP.textContent = `Ver ${this.id}`;
        nameP.style.position = "absolute";
        nameP.style.left = `${this.articulations[0].x}px`;
        nameP.style.top = `${this.articulations[0].y - 20}px`;
        document.querySelector("main").appendChild(nameP);
    }

    update() {
        this.clear();

        this.members.forEach(member => {
            member.rotate(member.way);
            member.update();
        });
    }

    clear() {
        const nameP = document.getElementById(`creature-name-${this.id}`);
        if (nameP) {
            nameP.remove();
        }

        this.articulations.forEach(articulation => articulation.clear());
        this.members.forEach(member => member.clear());
    }

    reset() {
        this.articulations[0].x = this.startPosition.x;
        this.articulations[0].y = this.startPosition.y;
    }
}