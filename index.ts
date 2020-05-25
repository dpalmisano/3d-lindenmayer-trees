import { State, Turtle } from './turtle3d/turtle';  
import { Puppeteer } from './turtle3d/puppeteer';
import { MeshAssembler, Scene } from './turtle3d/meshAssembler';
import { Controller } from './turtle3d/controller';

function toRadiants(angle: number): number {
    return angle * Math.PI / 180
}

export function turtle3d(generativeString: string, element: HTMLElement, angleDegrees: number) {
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