import Articulation from "./Articulation.js";
import Creature from "./Creature.js";
import VectorMath from "./VectorMath.js";
import Member from './Member.js';

let id = 0;

export default class CreatureGenerator {
    static generateArticulation(id) {
        return new Articulation(id, Math.random() * 200 + 1200, Math.random() * 200 + 500);
    }

    static generateCreature(numMembers) {
        const articulations = [];
        for (let i = 0; i < numMembers; i++) {
            articulations.push(this.generateArticulation(id + i));
        }

        const members = [];
        for (let i = 0; i < numMembers - 1; i++) {
            const startArticulation = articulations[i];
            const endArticulation = articulations[i + 1];

            const targetAngles = [VectorMath.randomAngle(), VectorMath.randomAngle(), VectorMath.randomAngle()];
            members.push(new Member(id + numMembers + i, startArticulation, endArticulation, targetAngles));
        }

        id += numMembers * 2;

        return new Creature(articulations, members);
    }
}