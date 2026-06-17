import Articulation from "./Articulation.js";
import CreatureGenerator from "./CreatureGenerator.js";
import VectorMath from "./VectorMath.js";

export default class Creature {
    constructor(id, articulations, members) {
        this.articulations = articulations;
        this.members = members;
        this.id = id;

        this.startPosition = {
            x: articulations[0].x,
            y: articulations[0].y
        };

        this.spentEnergy = 0;
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
        nameP.style.pointerEvents = "none";

        document.querySelector("main").appendChild(nameP);
    }

    update() {
        this.clear();

        this.members.forEach(member => {
            this.spentEnergy += member.rotate(member.way);
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
        this.articulations.forEach(articulation => articulation.reset());
    }

    clone(newId) {
        const clonedArticulations = this.articulations.map((articulation) => {
            const clonedArticulation = CreatureGenerator.generateArticulation();
            clonedArticulation.x = articulation.x;
            clonedArticulation.y = articulation.y;
            clonedArticulation.startPosition = {...articulation.startPosition };
            return clonedArticulation;
        });

        const clonedMembers = this.members.map((member, index) => {
            const startArticulation = clonedArticulations[index];
            const endArticulation = clonedArticulations[index + 1];
            const clonedMember = CreatureGenerator.generateMember(startArticulation, endArticulation);

            clonedMember.targetAngles = [...member.targetAngles];
            clonedMember.targetAngleIndex = member.targetAngleIndex;
            clonedMember.way = member.way;
            clonedMember.angle = member.angle;
            clonedMember.velocity = {...member.velocity };
            clonedMember.length = member.length;
            clonedMember.strenght = member.strenght;

            return clonedMember;
        });

        return new Creature(newId, clonedArticulations, clonedMembers);
    }

    mutate(newId) {
        const clone = this.clone(newId);

        clone.articulations.forEach((articulation, index) => articulation.mutate(clone.articulations[index - 1] || articulation));
        clone.members.forEach(member => member.mutate());

        const shouldChangeMemberNumber = Math.random() < 0.8;

        if (!shouldChangeMemberNumber) return clone;

        if (Math.random() < 0.5 && clone.members.length > 1) {
            clone.members.pop();
            clone.articulations.pop();
        } else {
            const lastArticulation = clone.articulations[clone.articulations.length - 1];
            const newArticulation = CreatureGenerator.generateArticulation();
            clone.articulations.push(newArticulation);

            const newMember = CreatureGenerator.generateMember(lastArticulation, newArticulation);
            clone.members.push(newMember);
        }

        return clone;
    }

    getScore() {
        const distance = VectorMath.distance(this.articulations[0], this.startPosition);
        return distance * 45 - this.spentEnergy / 8;
    }
}