import { FRICTION, MOVE_FACTOR } from "../consts.js";
import VectorMath from "./VectorMath.js";

export default class Member {
    constructor(id, startArticulation, endArticulation, targetAngles) {
        this.id = id;
        this.length = VectorMath.distance(startArticulation, endArticulation);
        this.startArticulation = startArticulation;
        this.endArticulation = endArticulation;
        this.angle = VectorMath.angleBetweenFromHorizontal(startArticulation, endArticulation);
        this.velocity = {
            x: 0,
            y: 0
        }
        this.targetAngles = targetAngles;
        this.targetAngleIndex = 0;
        this.way = VectorMath.getWay(this.targetAngles[0], this.angle);
        this.strenght = this.length / 100;
    }

    rotate(angle) {
        let delta = angle - this.angle;
        delta /= this.length ** 2 / 1000; // More length = harder to rotate

        const force = {
            x: this.length * Math.cos(VectorMath.degreeToRadian(delta)) * this.strenght,
            y: this.length * Math.sin(VectorMath.degreeToRadian(delta)) * this.strenght
        };

        this.velocity.x += force.x / MOVE_FACTOR;
        this.velocity.y += force.y / MOVE_FACTOR;

        if (this.angle + angle > 360) {
            this.angle -= 360;
        } else if (this.angle + angle < 0) {
            this.angle += 360;
        }
        this.angle += angle;
    }

    toHTMLElement() {
        const memberElement = document.createElement("div");
        memberElement.className = "member";
        memberElement.id = `member-${this.id}`;
        memberElement.style.position = "absolute";
        memberElement.style.width = `${this.length}px`;
        memberElement.style.height = `${this.strenght * 10}px`;
        memberElement.style.transform = `rotate(${this.angle}deg)`;
        memberElement.style.left = `${this.startArticulation.x}px`;
        memberElement.style.top = `${this.startArticulation.y}px`;

        return memberElement;
    }

    updateWay() {
        let condition;

        if (this.way === 1) {
            condition = this.angle >= this.targetAngles[this.targetAngleIndex];
        } else {
            condition = this.angle <= this.targetAngles[this.targetAngleIndex];
        }

        if (condition) {
            if (this.targetAngleIndex === this.targetAngles.length - 1) {
                this.targetAngleIndex = 0;
            } else {
                this.targetAngleIndex++;
            }
            this.way = VectorMath.getWay(this.targetAngles[this.targetAngleIndex], this.angle);
        }
    }


    update() {
        this.updateWay();

        const radians = VectorMath.degreeToRadian(this.angle);
        this.endArticulation.x = this.startArticulation.x + this.length * Math.cos(radians);
        this.endArticulation.y = this.startArticulation.y + this.length * Math.sin(radians);

        this.startArticulation.x += this.velocity.x / 2;
        this.startArticulation.y += this.velocity.y / 2;

        this.endArticulation.x -= this.velocity.x / 2;
        this.endArticulation.y -= this.velocity.y / 2;

        this.velocity.x *= FRICTION;
        this.velocity.y *= FRICTION;
    }

    clear() {
        const oldElement = document.getElementById(`member-${this.id}`);
        if (oldElement) {
            oldElement.remove();
        }
    }

    render() {
        document.querySelector("main").appendChild(this.toHTMLElement());
    }

    mutate() {
        if (Math.random() < 0.5) {
            const newTargetAngles = this.targetAngles.map(angle => {
                const delta = Math.random() * 50 - 25;
                return angle + delta;
            });
        }
    }
}