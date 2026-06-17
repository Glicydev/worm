import Articulation from "./Articulation.js";
import Creature from "./Creature.js";
import VectorMath from "./VectorMath.js";
import Member from './Member.js';

let creatureId = 0;

export default class CreatureGenerator {
    id = 0;

    static resetId() {
        this.id = 0;
        creatureId = 0;
    }

    static generateArticulation(idParam) {
        return new Articulation(idParam || this.id++, Math.random() * 200 + 1200, Math.random() * 200 + 500);
    }

    static generateMember(startArticulation, endArticulation) {
        const targetAngles = [
            VectorMath.randomAngle(),
            VectorMath.randomAngle(),
            VectorMath.randomAngle()
        ];

        return new Member(
            this.id++,
            startArticulation,
            endArticulation,
            targetAngles
        )
    }

    static generateCreature(paramId = null, numArticulations = Math.floor(Math.random() * 8) + 2) {
        const articulations = [];

        for (let i = 0; i < numArticulations; i++) {
            articulations.push(this.generateArticulation(this.id++));
        }

        const members = [];

        for (let i = 0; i < articulations.length - 1; i++) {
            members.push(this.generateMember(articulations[i], articulations[i + 1]));
        }

        creatureId++;

        return new Creature(paramId || creatureId, articulations, members);
    }
}