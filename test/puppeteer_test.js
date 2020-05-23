const assert = require('assert');
const sinon = require('sinon');

var { State, Turtle } = require('../turtle3d/turtle.js')


const THREE = require('three')

var { Puppeteer } = require('../turtle3d/puppeteer.js')


describe('Puppeteer play', () => {

  it('with symbol [ should call turtle stack', () => {
    const state = State.build(0);
    const turtle = new Turtle(state);
    const stackSpy = sinon.spy(turtle, 'stack' );
    const puppeteer = new Puppeteer(['['], turtle, { 'getMesh': () => {}});

    puppeteer.play()

    assert.equal(stackSpy.called, true);
  })

  it('with symbol ] should call turtle unstack', () => {
    const state = State.build(0);
    const turtle = new Turtle(state);
    const unstackSpy = sinon.spy(turtle, 'unstack' );
    const puppeteer = new Puppeteer([']'], turtle, { 'getMesh': () => {}});

    puppeteer.play()

    assert.equal(unstackSpy.called, true);
  })

  it('with symbol + should call turtle yaw right', () => {
    const state = State.build(0);
    const turtle = new Turtle(state);
    const yawSpy = sinon.spy(turtle, 'yaw');
    const puppeteer = new Puppeteer(['+'], turtle, { 'getMesh': () => {}});

    puppeteer.play()

    assert.equal(yawSpy.calledOnceWith('RIGHT'), true);
  })

  it('with symbol - should call turtle yaw left', () => {
    const state = State.build(0);
    const turtle = new Turtle(state);
    const yawSpy = sinon.spy(turtle, 'yaw');
    const puppeteer = new Puppeteer(['-'], turtle, { 'getMesh': () => {}});

    puppeteer.play()

    assert.equal(yawSpy.calledOnceWith('LEFT'), true);
  })

  it('with symbol / should call turtle roll right', () => {
    const state = State.build(0);
    const turtle = new Turtle(state);
    const rollSpy = sinon.spy(turtle, 'roll');
    const puppeteer = new Puppeteer(['/'], turtle, { 'getMesh': () => {}});

    puppeteer.play()

    assert.equal(rollSpy.calledOnceWith('RIGHT'), true);
  })

  it('with symbol \\ should call turtle roll left', () => {
    const state = State.build(0);
    const turtle = new Turtle(state);
    const rollSpy = sinon.spy(turtle, 'roll');
    const puppeteer = new Puppeteer(['\\'], turtle, { 'getMesh': () => {}});

    puppeteer.play()

    assert.equal(rollSpy.calledOnceWith('LEFT'), true);
  })

  it('with symbol ^ should call turtle pitch up', () => {
    const state = State.build(0);
    const turtle = new Turtle(state);
    const pitchSpy = sinon.spy(turtle, 'pitch');
    const puppeteer = new Puppeteer(['^'], turtle, { 'getMesh': () => {}});

    puppeteer.play()

    assert.equal(pitchSpy.calledOnceWith('UP'), true);
  })

  it('with symbol - should call turtle pitch down', () => {
    const state = State.build(0);
    const turtle = new Turtle(state);
    const pitchSpy = sinon.spy(turtle, 'pitch');
    const puppeteer = new Puppeteer(['_'], turtle, { 'getMesh': () => {}});

    puppeteer.play()

    assert.equal(pitchSpy.calledOnceWith('DOWN'), true);
  })

  it('with symbol A should call turtle draw', () => {
    const state = State.build(0);
    const turtle = new Turtle(state);
    const drawSpy = sinon.spy(turtle, 'draw');
    const puppeteer = new Puppeteer(['A'], turtle, { 'getMesh': () => {}});

    puppeteer.play()

    assert.equal(drawSpy.called, true);
  })

  it('return an object with mesh and centre', () => {
    const state = State.build(0);
    const turtle = new Turtle(state);
    sinon.stub(turtle, 'getCenter').returns(new THREE.Vector3(1, 2, 3))


    const testMesh = new THREE.Mesh();
    const puppeteer = new Puppeteer(['A'], turtle, { 'getMesh': () => testMesh } );

    const { mesh, center } = puppeteer.play();
    assert.equal(mesh.type, 'Mesh');
    assert.deepEqual(center, new THREE.Vector3(1, 2, 3))
  })

})