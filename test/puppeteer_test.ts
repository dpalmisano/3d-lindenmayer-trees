import * as assert from 'assert';
import * as sinon from 'sinon';

import * as THREE from 'three';

import { State, Turtle } from '../turtle3d/turtle';
import { Puppeteer } from '../turtle3d/puppeteer';
import { MeshAssembler } from '../turtle3d/meshAssembler';

describe('Puppeteer play', () => {

  it('with symbol [ should call turtle stack', () => {
    const state = State.build(0);
    const turtle = new Turtle(state);
    const stackSpy = sinon.spy(turtle, 'stack' );

    const meshAssemblerMock = <MeshAssembler> <any> sinon.mock(MeshAssembler);
    meshAssemblerMock.getMesh = sinon.spy();

    const puppeteer = new Puppeteer(['['], turtle, meshAssemblerMock);

    puppeteer.play()

    assert.equal(stackSpy.called, true);
  })

  it('with symbol ] should call turtle unstack', () => {
    const state = State.build(0);
    const turtle = new Turtle(state);
    const unstackSpy = sinon.spy(turtle, 'unstack');

    const meshAssemblerMock = <MeshAssembler> <any> sinon.mock(MeshAssembler);
    meshAssemblerMock.getMesh = sinon.spy();

    const puppeteer = new Puppeteer([']'], turtle, meshAssemblerMock);

    puppeteer.play()

    assert.equal(unstackSpy.called, true);
  })

  it('with symbol + should call turtle yaw right', () => {
    const state = State.build(0);
    const turtle = new Turtle(state);
    const yawSpy = sinon.spy(turtle, 'yaw');

    const meshAssemblerMock = <MeshAssembler> <any> sinon.mock(MeshAssembler);
    meshAssemblerMock.getMesh = sinon.spy();

    const puppeteer = new Puppeteer(['+'], turtle, meshAssemblerMock);

    puppeteer.play()

    assert.equal(yawSpy.calledOnceWith('RIGHT'), true);
  })

  it('with symbol - should call turtle yaw left', () => {
    const state = State.build(0);
    const turtle = new Turtle(state);
    const yawSpy = sinon.spy(turtle, 'yaw');

    const meshAssemblerMock = <MeshAssembler> <any> sinon.mock(MeshAssembler);
    meshAssemblerMock.getMesh = sinon.spy();

    const puppeteer = new Puppeteer(['-'], turtle, meshAssemblerMock);

    puppeteer.play()

    assert.equal(yawSpy.calledOnceWith('LEFT'), true);
  })

  it('with symbol / should call turtle roll right', () => {
    const state = State.build(0);
    const turtle = new Turtle(state);
    const rollSpy = sinon.spy(turtle, 'roll');

    const meshAssemblerMock = <MeshAssembler> <any> sinon.mock(MeshAssembler);
    meshAssemblerMock.getMesh = sinon.spy();

    const puppeteer = new Puppeteer(['/'], turtle, meshAssemblerMock);

    puppeteer.play()

    assert.equal(rollSpy.calledOnceWith('RIGHT'), true);
  })

  it('with symbol \\ should call turtle roll left', () => {
    const state = State.build(0);
    const turtle = new Turtle(state);
    const rollSpy = sinon.spy(turtle, 'roll');

    const meshAssemblerMock = <MeshAssembler> <any> sinon.mock(MeshAssembler);
    meshAssemblerMock.getMesh = sinon.spy();

    const puppeteer = new Puppeteer(['\\'], turtle, meshAssemblerMock);

    puppeteer.play()

    assert.equal(rollSpy.calledOnceWith('LEFT'), true);
  })

  it('with symbol ^ should call turtle pitch up', () => {
    const state = State.build(0);
    const turtle = new Turtle(state);
    const pitchSpy = sinon.spy(turtle, 'pitch');

    const meshAssemblerMock = <MeshAssembler> <any> sinon.mock(MeshAssembler);
    meshAssemblerMock.getMesh = sinon.spy();

    const puppeteer = new Puppeteer(['^'], turtle, meshAssemblerMock);

    puppeteer.play()

    assert.equal(pitchSpy.calledOnceWith('UP'), true);
  })

  it('with symbol - should call turtle pitch down', () => {
    const state = State.build(0);
    const turtle = new Turtle(state);
    const pitchSpy = sinon.spy(turtle, 'pitch');

    const meshAssemblerMock = <MeshAssembler> <any> sinon.mock(MeshAssembler);
    meshAssemblerMock.getMesh = sinon.spy();

    const puppeteer = new Puppeteer(['_'], turtle, meshAssemblerMock);

    puppeteer.play()

    assert.equal(pitchSpy.calledOnceWith('DOWN'), true);
  })

  it('with symbol A should call turtle draw', () => {
    const state = State.build(0);
    const turtle = new Turtle(state);
    const drawSpy = sinon.spy(turtle, 'draw');

    const meshAssemblerMock = <MeshAssembler> <any> sinon.mock(MeshAssembler);
    meshAssemblerMock.getMesh = sinon.spy();

    const puppeteer = new Puppeteer(['A'], turtle, meshAssemblerMock);

    puppeteer.play()

    assert.equal(drawSpy.called, true);
  })

  it('return an object with mesh and centre', () => {
    const state = State.build(0);
    const turtle = new Turtle(state);
    sinon.stub(turtle, 'getCenter').returns(new THREE.Vector3(1, 2, 3))


    const testMesh = new THREE.Mesh();

    const meshAssemblerMock = <MeshAssembler> <any> sinon.mock(MeshAssembler);
    meshAssemblerMock.getMesh = () => testMesh

    const puppeteer = new Puppeteer(['A'], turtle, meshAssemblerMock);

    const { mesh, center } = puppeteer.play();
    assert.equal(mesh.type, 'Mesh');
    assert.deepEqual(center, new THREE.Vector3(1, 2, 3))
  })

})