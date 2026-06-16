import Articulation from "./Articulation.js";
import Creature from "./Creature.js";
import VectorMath from "./VectorMath.js";
import Member from './Member.js';

let id = 0;
let creatureId = 0;

export default class CreatureGenerator {
    static resetId() {
        id = 0;
        creatureId = 0;
    }

    static generateArticulation(id) {
        console.log(id)
        return new Articulation(id, Math.random() * 200 + 1200, Math.random() * 200 + 500);
    }

    static generateCreature(numArticulations = Math.floor(Math.random() * 8) + 2) {
        const articulations = [];

        for (let i = 0; i < numArticulations; i++) {
            articulations.push(this.generateArticulation(id++));
        }

        const members = [];

        for (let i = 0; i < articulations.length - 1; i++) {
            const targetAngles = [
                VectorMath.randomAngle(),
                VectorMath.randomAngle(),
                VectorMath.randomAngle()
            ];

            members.push(
                new Member(
                    id++,
                    articulations[i],
                    articulations[i + 1],
                    targetAngles
                )
            );
        }

        creatureId++;

        return new Creature(creatureId, articulations, members);
    }
}