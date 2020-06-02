import * as assert from 'assert';
import * as sinon from 'sinon';

import * as THREE from 'three';

import { Model } from '../turtle3d/puppeteer';
import { MeshAssembler, Scene } from '../turtle3d/meshAssembler';

describe('MeshAssembler', () => {

  const tubePrecision = 5;
  const tubeRadius = 0.2;
  var meshAssembler;

  beforeEach(() => {
    meshAssembler = new MeshAssembler(tubePrecision, tubeRadius);
  })

  it('should build a mesh', () => {
    const edges = [ [ new THREE.Vector3(0, 0, 0 ), new THREE.Vector3 (0, 1, 0 ) ] ];
    const mesh = meshAssembler.getMesh(edges);
    assert.notEqual(mesh, undefined);
  })

});

describe('Scene', () => {

  const initialRadius = 0.5;
  const initialCenter = new THREE.Vector3(0, 0,0 );
  var scene;

  var setSizeSpy;
  const testDomElement = {};

  var lookAtSpy;
  var engineRenderSpy;
  var appendChildSpy;

  beforeEach(() => {
    setSizeSpy = sinon.spy();
    engineRenderSpy = sinon.spy();
    const engineMock = {
      setSize: setSizeSpy,
      domElement: testDomElement,
      render: engineRenderSpy
    }

    appendChildSpy = sinon.spy();
    const elementMock: HTMLElement = <HTMLElement> <any> sinon.mock(HTMLElement);
    elementMock.appendChild = appendChildSpy;

    lookAtSpy = sinon.spy();
    const cameraMock = {
      position: {
        x: 0,
        y: 0,
        z: 0
      },
      lookAt: lookAtSpy
    }

    sinon.stub(THREE, 'WebGLRenderer').returns(engineMock);
    sinon.stub(THREE, 'PerspectiveCamera').returns(cameraMock);

    const modelMock: Model = {
      mesh: <THREE.Mesh> <any> sinon.mock(THREE.Mesh),
      center: initialCenter,
      radius: initialRadius
    }

    scene = new Scene(modelMock, elementMock);
  });

  afterEach(function () {
    sinon.restore();
  });

  it('constructor should append engine element to the dom element', () => {
    sinon.assert.calledWith(appendChildSpy, testDomElement);
  });

  it('constructor should initialise the camera', () => {
    assert.equal(scene.camera !== undefined, true);
    const { rotation, pitch, radius, zoom, center } = scene.cameraSettings;
    assert.equal(rotation, Math.PI / 4);
    assert.equal(pitch, Math.PI / 2);
    assert.equal(radius,  initialRadius);
    assert.equal(pitch, Math.PI / 2);
    assert.equal(zoom, 1.7);
    assert.equal(center, initialCenter);
    sinon.assert.calledWith(setSizeSpy, 1000, 750);
  });

  it('render should call shoot and update the camera position', () => {
    assert.deepEqual(scene.camera.position, initialCenter);
    scene.render();
    assert.deepEqual(scene.camera.position, {
      x: 0.6010407640085654,
      y: 5.204748896376251e-17,
      z: 0.6010407640085653
    })
  });

  it('render should call shoot and call camera.lookat', () => {
    scene.render();
    sinon.assert.calledWith(lookAtSpy, 0, 0, 0);
  });

  it('zoomIn should update camera settings', () => {
    assert.equal(scene.cameraSettings.zoom, 1.7);
    scene.zoomIn();
    assert.equal(scene.cameraSettings.zoom, 1.649);
  });

  it('zoomIn should call engine.render', () => {
    sinon.assert.notCalled(engineRenderSpy);
    scene.zoomIn();
    sinon.assert.called(engineRenderSpy);
  });

  it('zoomOut should update camera settings', () => {
    assert.equal(scene.cameraSettings.zoom, 1.7);
    scene.zoomOut();
    assert.equal(scene.cameraSettings.zoom, 1.751);
  });

  it('zoomOut should call engine.render', () => {
    sinon.assert.notCalled(engineRenderSpy);
    scene.zoomOut();
    sinon.assert.called(engineRenderSpy);
  });

});