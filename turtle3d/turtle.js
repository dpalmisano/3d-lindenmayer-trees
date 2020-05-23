const THREE = require('three');

function buildQuaternion(axis, angle) {
    const quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle(axis, angle);
    return quaternion;
}

class State {

    static axes = {
        X: new THREE.Vector3(1, 0, 0),
        Y: new THREE.Vector3(0, 1, 0),
        Z: new THREE.Vector3(0, 0, 1),
    }

    static build(angle) {
        return new State(
            angle,
            new THREE.Vector3(0, 0, 0),
            new THREE.Quaternion()
        )
    }

    static copy(otherState) {
        var state = new State(
            otherState.angle,
            otherState.getPosition(),
            otherState.getQuaternion(),
            otherState.getQuaternions()
        ) 
        return state;
    }

    quaternions = {
        'yaw': {},
        'roll': {},
        'pitch': {}
    }

    constructor(angle, position, quaternion, quaternions) {
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

    initQuaternions() {
        this.quaternions.yaw.RIGHT = buildQuaternion(State.axes.Z, this.angle);
        this.quaternions.yaw.LEFT = buildQuaternion(State.axes.Z, -this.angle);
        this.quaternions.roll.RIGHT = buildQuaternion(State.axes.Y, this.angle);
        this.quaternions.roll.LEFT = buildQuaternion(State.axes.Y, -this.angle);
        this.quaternions.pitch.UP = buildQuaternion(State.axes.X, this.angle);
        this.quaternions.pitch.DOWN = buildQuaternion(State.axes.X, -this.angle);
    }

    getQuaternions() {
        var result = {}
        Object.keys(this.quaternions).forEach(actionKey => {
            result[actionKey] = {}
            Object.keys(this.quaternions[actionKey]).forEach(
                direction => result[actionKey][direction] = this.quaternions[actionKey][direction].clone()
            )
        })
        return result;
    }

    getQuaternion() {
        return this.quaternion.clone();
    }

    update(op, direction) {
        const q = this.quaternions[op][direction]
        this.quaternion.multiply(q)
    }

    advance() {
        this.position = this.position.add(this.getDirectionVector());
    }

    getDirectionVector() {
        var v = new THREE.Vector3(0, 1, 0);
		return v.applyQuaternion(this.quaternion);
    }

    getPosition() {
        return this.position.clone()
    }

    setArmed(armed) {
        this.armed = armed;
    }

    isArmed() {
        return this.armed;
    }

}

class Turtle {

    boundingBox = {
        x: { min: 0, max: 0 },
        y: { min: 0, max: 0 },
        z: { min: 0, max: 0 }
    }



    constructor(state) {
        this.state = state;
        this.edges = [];
        this.states = [];
        this.workingEdges = [[ state.getPosition() ]];
        this.center = null;
        this.radius = null;
    }

    yaw(direction) {
        this.state.update('yaw', direction)
        this.state.setArmed(false)
    }

    roll(direction) {
        this.state.update('roll', direction)
    }

    pitch(direction) {
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
        var edge = this.workingEdges.pop();
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

    updateCenter() {
        var xRange = this.boundingBox.x.max - this.boundingBox.x.min;
		var yRange = this.boundingBox.y.max - this.boundingBox.y.min;
		var zRange = this.boundingBox.z.max - this.boundingBox.z.min;
		
		this.center = new THREE.Vector3(
			this.boundingBox.x.min + xRange / 2,
			this.boundingBox.y.min + yRange / 2,
            this.boundingBox.z.min + zRange / 2
        );
    }

    updateRadius() {
        var xRange = this.boundingBox.x.max - this.boundingBox.x.min;
		var yRange = this.boundingBox.y.max - this.boundingBox.y.min;
        var zRange = this.boundingBox.z.max - this.boundingBox.z.min;

        this.radius = new THREE.Vector3(xRange, yRange, zRange).length() / 2;
    }

    getEdges() {
        this.edges.push(this.workingEdges.pop());
        return this.edges.map(p => p && p.map(v => v.clone()))
    }

    updateMin(coord, position) {
        if(position[coord] < this.boundingBox[coord].min) {
            this.boundingBox[coord].min = position[coord]
        }
    }

    updateMax(coord, position) {
        if(position[coord] > this.boundingBox[coord].max) {
            this.boundingBox[coord].max = position[coord]
        }
    }

    getCenter() {
        return this.center;
    }

    getRadius() {
        return this.radius;
    }

}

module.exports = { State, Turtle }