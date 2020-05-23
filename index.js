const { State, Turtle } = require('./turtle3d/turtle')
const { Puppeteer } = require('./turtle3d/puppeteer')
const { MeshAssembler, Scene } = require('./turtle3d/meshAssembler')
const { Controller } = require('./turtle3d/controller')

function toRadiants(angle) {
    return angle * Math.PI / 180
}

export function turtle3d(generativeString, element, angleDegrees) {
    const angle = toRadiants(angleDegrees);
    const state = State.build(angle);
    const turtle = new Turtle(state);

    const meshAssembler = new MeshAssembler(5, 0.02);

    const symbols = generativeString.split('');
    const puppeteer = new Puppeteer(symbols, turtle, meshAssembler);
    const model = puppeteer.play();
    
    const scene = new Scene(model, element);
    scene.render();

    return new Controller(scene, element);
}