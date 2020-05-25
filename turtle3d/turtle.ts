import * as THREE from 'three';

import type { Vector3, Quaternion, Vector } from 'three';

interface Quaternions { 
    [index: string]: {
        [index: string]: Quaternion
    },
    'yaw'?: {
        RIGHT?: Quaternion,
        LEFT?: Quaternion
    },
    'roll'?: {
        RIGHT?: Quaternion,
        LEFT?: Quaternion
    },
    'pitch'?: {
        UP?: Quaternion,
        DOWN?: Quaternion
    }
}

function buildQuaternion(axis: Vector3, angle: number): Quaternion {
    const quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle(axis, angle);
    return quaternion;
}

export class State {

    static axes = {
        X: new THREE.Vector3(1, 0, 0),
        Y: new THREE.Vector3(0, 1, 0),
        Z: new THREE.Vector3(0, 0, 1),
    }

    static build(angle: number): State {
        return new State(
            angle,
            new THREE.Vector3(0, 0, 0),
            new THREE.Quaternion()
        )
    }

    static copy(otherState: State): State {
        var state = new State(
            otherState.angle,
            otherState.getPosition(),
            otherState.getQuaternion(),
            otherState.getQuaternions()
        ) 
        return state;
    }

    armed: boolean;
    angle: number;
    position: Vector3;
    quaternion: Quaternion;
    quaternions: Quaternions;

    constructor(angle: number, position: Vector3, quaternion: Quaternion, quaternions?: Quaternions) {
        this.armed = false;
        this.angle = angle;
        this.position = position.clone();
        this.quaternion = quaternion.clone()
        if(quaternions === undefined) {
            this.initQuaternions();
        } else {
            this.quaternions = quaternions
        }
    }

    initQuaternions(): void {
        this.quaternions.yaw.RIGHT = buildQuaternion(State.axes.Z, this.angle);
        this.quaternions.yaw.LEFT = buildQuaternion(State.axes.Z, -this.angle);
        this.quaternions.roll.RIGHT = buildQuaternion(State.axes.Y, this.angle);
        this.quaternions.roll.LEFT = buildQuaternion(State.axes.Y, -this.angle);
        this.quaternions.pitch.UP = buildQuaternion(State.axes.X, this.angle);
        this.quaternions.pitch.DOWN = buildQuaternion(State.axes.X, -this.angle);
    }

    getQuaternions(): Quaternions {
        var result: Quaternions = {};
        Object.keys(this.quaternions).forEach((actionKey: string) => {
            result[actionKey] = {}
            Object.keys(this.quaternions[actionKey]).forEach(
                direction => result[actionKey][direction] = this.quaternions[actionKey][direction].clone()
            )
        })
        return result;
    }

    getQuaternion(): Quaternion {
        return this.quaternion.clone();
    }

    update(op: string, direction: string): void {
        const q = this.quaternions[op][direction]
        this.quaternion.multiply(q)
    }

    advance(): void {
        this.position = this.position.add(this.getDirectionVector());
    }

    getDirectionVector(): Vector3 {
        var v = new THREE.Vector3(0, 1, 0);
		return v.applyQuaternion(this.quaternion);
    }

    getPosition(): Vector3 {
        return this.position.clone()
    }

    setArmed(armed: boolean): void {
        this.armed = armed;
    }

    isArmed(): boolean {
        return this.armed;
    }

}

interface BoundingBox {
    [index: string]: { [index: string]: number }
    x: { min: number, max: number },
    y: { min: number, max: number },
    z: { min: number, max: number },
}

export class Turtle {

    boundingBox: BoundingBox = {
        x: { min: 0, max: 0 },
        y: { min: 0, max: 0 },
        z: { min: 0, max: 0 }
    }

    state: State;
    edges: Array<Array<Vector3>>;
    states: Array<State>;
    workingEdges: Array<Array<Vector3>>;
    center: Vector3;
    radius: number;

    constructor(state: State) {
        this.state = state;
        this.edges = [];
        this.states = [];
        this.workingEdges = [[ state.getPosition() ]];
        this.center = null;
        this.radius = null;
    }

    yaw(direction: string) {
        this.state.update('yaw', direction)
        this.state.setArmed(false)
    }

    roll(direction: string) {
        this.state.update('roll', direction)
    }

    pitch(direction: string) {
        this.state.update('pitch', direction)
        this.state.setArmed(false)
    }

    stack() {
        const state = State.copy(this.state)
        this.states.push(state);
        this.state.setArmed(false)
        this.workingEdges.push( [state.getPosition()] );
    }

    unstack() {
        this.state = this.states.pop();
        var edge: Array<Vector3> = this.workingEdges.pop();
        if(edge.length > 1)
            this.edges.push(edge);
    }

    draw() {
        this.state.advance();
        const position = this.state.getPosition();
        this.updateMin('x', position)
        this.updateMin('y', position)
        this.updateMin('z', position)

        this.updateMax('x', position)
        this.updateMax('y', position)
        this.updateMax('z', position)

        if(this.state.isArmed()) {
            this.workingEdges[this.workingEdges.length - 1].pop();
        } else {
            this.state.setArmed(true);
        }

        this.workingEdges[this.workingEdges.length - 1].push(position.clone());

        this.updateCenter();
        this.updateRadius();

    }

    updateCenter(): void {
        var xRange = this.boundingBox.x.max - this.boundingBox.x.min;
		var yRange = this.boundingBox.y.max - this.boundingBox.y.min;
		var zRange = this.boundingBox.z.max - this.boundingBox.z.min;
		
		this.center = new THREE.Vector3(
			this.boundingBox.x.min + xRange / 2,
			this.boundingBox.y.min + yRange / 2,
            this.boundingBox.z.min + zRange / 2
        );
    }

    updateRadius(): void {
        var xRange = this.boundingBox.x.max - this.boundingBox.x.min;
		var yRange = this.boundingBox.y.max - this.boundingBox.y.min;
        var zRange = this.boundingBox.z.max - this.boundingBox.z.min;

        this.radius = new THREE.Vector3(xRange, yRange, zRange).length() / 2;
    }

    getEdges(): Array<Array<Vector3>> {
        this.edges.push(this.workingEdges.pop());
        return this.edges.map(p => p && p.map(v => v.clone()))
    }

    updateMin(coord: 'x' | 'y' | 'z', position: Vector3): void {
        if(position[coord] < this.boundingBox[coord].min) {
            this.boundingBox[coord].min = position[coord]
        }
    }

    updateMax(coord: 'x' | 'y' | 'z', position: Vector3): void {
        if(position[coord] > this.boundingBox[coord].max) {
            this.boundingBox[coord].max = position[coord]
        }
    }

    getCenter(): Vector3 {
        return this.center;
    }

    getRadius(): number {
        return this.radius;
    }

}