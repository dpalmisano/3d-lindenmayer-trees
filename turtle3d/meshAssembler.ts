import * as THREE from 'three';

import { Model } from './puppeteer'

export class MeshAssembler {
    tubePrecision: number;
    tubeRadius: number;
    geometry: THREE.Geometry;
    fabric: THREE.MeshPhongMaterial;
    terminal: THREE.SphereGeometry;

    constructor(tubePrecision: number, tubeRadius: number) {
        this.tubePrecision = tubePrecision;
        this.tubeRadius = tubeRadius;
        this.geometry = new THREE.Geometry();
        this.terminal = new THREE.SphereGeometry(0.3, 5, 5);
        this.fabric = new THREE.MeshPhongMaterial({
            emissive: new THREE.Color("rgb(196, 159, 113)").multiplyScalar(0.3),
			color: new THREE.Color("rgb(197, 159, 113)"),
			specular: new THREE.Color("rgb(255, 255, 255)").multiplyScalar(0.3),
			shininess: 4
		})
    }

    processEdge(edge: Array<THREE.Vector3>) {
        if(edge.length <= 1) {
            return;
        }
        
        var tube = new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3(edge),
            (edge.length - 1) * 4,
            this.tubeRadius,
            this.tubePrecision,
            false
        );
        
        this.geometry.merge(tube);
		tube.dispose();
    }

    getMesh(edges: Array<Array<THREE.Vector3>>): THREE.Mesh {
        edges.forEach(edge => this.processEdge(edge));
        return new THREE.Mesh(this.geometry, this.fabric);
    }

    getRadius() {
        return this.geometry.boundingSphere.radius;
    }

}

interface CameraSettings {
    rotation: number,
    pitch: number,
    zoom: number,
    center: THREE.Vector3,
    radius: number,
    speed: number
}

export class Scene {
    mesh: THREE.Mesh;
    center: THREE.Vector3;
    threeScene: THREE.Scene;
    engine: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;

    cameraSettings: CameraSettings;
    
    constructor(model: Model, element: HTMLElement) {
        const { mesh, center, radius } = model;
        this.mesh = mesh;
        this.center = center;
        
        this.engine = new THREE.WebGLRenderer({
            antialias: true,    
            alpha: true
        });
        this.engine.setSize(1000, 750);

        this.threeScene = new THREE.Scene();
        this.threeScene.add(this.mesh);
        this.threeScene.add(new THREE.DirectionalLight(new THREE.Color("rgb(237, 236, 201)")));
        
        element.innerHTML = '';
        element.appendChild(this.engine.domElement);

        this.initCamera(radius);
    }

    initCamera(radius: number) {
        this.camera = new THREE.PerspectiveCamera(
			70,
			400 / 400,
			0.1,
            10000
        );
        this.cameraSettings = {
            rotation: Math.PI / 4,
            pitch: Math.PI / 2,
            zoom: 1.7,
            center: this.center,
            radius: radius,
            speed: 0.01
        };
    }

    shoot() {
        const { rotation, pitch, radius, zoom } = this.cameraSettings;
        this.camera.position.x = this.cameraSettings.center.x + Math.cos(rotation) * radius * zoom * Math.sin(pitch);
		this.camera.position.z = this.cameraSettings.center.z + Math.sin(rotation) * radius * zoom * Math.sin(pitch);
        this.camera.position.y = this.cameraSettings.center.y + Math.cos(pitch) * radius * zoom;
        this.camera.lookAt(this.cameraSettings.center.x, this.cameraSettings.center.y, this.cameraSettings.center.z);
    }

    moveCamera(x: number, y: number) {
        this.cameraSettings.rotation += x * this.cameraSettings.speed;
        this.cameraSettings.pitch -= y * this.cameraSettings.speed;
        this.render();
    }

    zoomIn() {
        this.cameraSettings.zoom *= 1 - 0.03;
		
        if(this.cameraSettings.zoom < 0.1)
            this.cameraSettings.zoom = 0.1;
        
        this.render();
    }

    zoomOut() {
        this.cameraSettings.zoom *= 1 + 0.03;
		
        if(this.cameraSettings.zoom > 6)
            this.cameraSettings.zoom = 6;
        
        this.render();
    }

    render() {
        this.shoot();
        this.engine.render(this.threeScene, this.camera);
    }

}