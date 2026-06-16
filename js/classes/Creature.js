export default class Creature {
    constructor(articulations, members) {
        this.articulations = articulations;
        this.members = members;
    }

    draw() {
        this.articulations.forEach(articulation => articulation.render());

        this.members.forEach(member => member.render());
    }

    update() {
        this.members.forEach(member => {
            member.rotate(member.way);
            member.update();
        });
    }
}