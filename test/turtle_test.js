const assert = require('assert');
const sinon = require('sinon');

const THREE = require('three')

var { State, Turtle } = require('../turtle3d/turtle.js')

const angle = 45;

describe('State', () => {

  beforeEach(() => {
    state = State.build(angle);
  })

  describe('init', () => {

    it('should build at the correct position', () => {
      assert.deepStrictEqual(state.getPosition(), new THREE.Vector3(0, 0, 0))
    })

    it('should build with correct quaternion', () => {
      assert.deepStrictEqual(state.quaternion, new THREE.Quaternion())
    })

    it('should build with correct quaternion for right yaw', () => {
      const { yaw: { RIGHT: {x, y, z, w} } } = state.quaternions;
      assert.equal(x, 0)
      assert.equal(y, 0)
      assert.equal(z, -0.4871745124605095)
      assert.equal(w, -0.8733046400935156)
    })

    it('should build with correct quaternion for left yaw', () => {
      const { yaw: { LEFT: {x, y, z, w} } } = state.quaternions;
      assert.equal(x, 0)
      assert.equal(y, 0)
      assert.equal(z, 0.4871745124605095)
      assert.equal(w, -0.8733046400935156)
    })


    it('should build with correct quaternion for right roll', () => {
      const { roll: { RIGHT: {x, y, z, w} } } = state.quaternions;
      assert.equal(x, 0)
      assert.equal(y, -0.4871745124605095)
      assert.equal(z, 0)
      assert.equal(w, -0.8733046400935156)
    })

    it('should build with correct quaternion for left roll', () => {
      const { roll: { LEFT: {x, y, z, w} } } = state.quaternions;
      assert.equal(x, 0)
      assert.equal(y, 0.4871745124605095)
      assert.equal(z, 0)
      assert.equal(w, -0.8733046400935156)
    })

    it('should build with correct quaternion for up pitch', () => {
      const { pitch: { UP: {x, y, z, w} } } = state.quaternions;
      assert.equal(x, -0.4871745124605095)
      assert.equal(y, 0)
      assert.equal(z, 0)
      assert.equal(w, -0.8733046400935156)
    })

    it('should build with correct quaternion for down pitch', () => {
      const { pitch: { DOWN: {x, y, z, w} } } = state.quaternions;
      assert.equal(x, 0.4871745124605095)
      assert.equal(y, 0)
      assert.equal(z, 0)
      assert.equal(w, -0.8733046400935156)
    })
  });

  describe('update', () => {

    it('should pitch up and get the new direction', () => {
      var direction = state.getDirectionVector()
      assert.deepStrictEqual(direction, new THREE.Vector3(0, 1, 0))
      state.update('pitch', 'UP')
      direction = state.getDirectionVector()
      assert.equal(direction.x, 0)
      assert.equal(direction.y, 0.5253219888177296)
      assert.equal(direction.z, 0.8509035245341184)
    })

    it('should pitch up and get the new direction', () => {
      var direction = state.getDirectionVector()
      assert.deepStrictEqual(direction, new THREE.Vector3(0, 1, 0))
      state.update('pitch', 'DOWN')
      direction = state.getDirectionVector()
      assert.equal(direction.x, 0)
      assert.equal(direction.y, 0.5253219888177296)
      assert.equal(direction.z, -0.8509035245341184)
    });

    it('should yaw right and get the new direction', () => {
      var direction = state.getDirectionVector()
      assert.deepStrictEqual(direction, new THREE.Vector3(0, 1, 0))
      state.update('yaw', 'RIGHT')
      direction = state.getDirectionVector()
      assert.equal(direction.x, -0.8509035245341184)
      assert.equal(direction.y, 0.5253219888177296)
      assert.equal(direction.z, 0)
    })

    it('should yaw left and get the new direction', () => {
      var direction = state.getDirectionVector()
      assert.deepStrictEqual(direction, new THREE.Vector3(0, 1, 0))
      state.update('yaw', 'LEFT')
      direction = state.getDirectionVector()
      assert.equal(direction.x, 0.8509035245341184)
      assert.equal(direction.y, 0.5253219888177296)
      assert.equal(direction.z, 0)
    })

    it('should roll right and get the new direction', () => {
      var direction = state.getDirectionVector()
      assert.deepStrictEqual(direction, new THREE.Vector3(0, 1, 0))
      state.update('roll', 'RIGHT')
      direction = state.getDirectionVector()
      assert.equal(direction.x, 0)
      assert.equal(direction.y, 1)
      assert.equal(direction.z, 0)
    })

    it('should roll left and get the new direction', () => {
      var direction = state.getDirectionVector()
      assert.deepStrictEqual(direction, new THREE.Vector3(0, 1, 0))
      state.update('roll', 'LEFT')
      direction = state.getDirectionVector()
      assert.equal(direction.x, 0)
      assert.equal(direction.y, 1)
      assert.equal(direction.z, 0)
    })

  });

  it('should set armed to true', () => {
    assert.equal(state.isArmed(), false);
    state.setArmed(true);
    assert.equal(state.isArmed(), true);
  })

  it('should clone quaternions on get', () => {
    const quaternions = state.quaternions;
    const clonedQuaternions = state.getQuaternions();
    assert.equal(quaternions === clonedQuaternions, false);
    assert.deepEqual(quaternions, clonedQuaternions);
  })

  it('should advance, keeping same direction but changing position', () => {
    var direction = state.getDirectionVector()
    assert.deepStrictEqual(direction, new THREE.Vector3(0, 1, 0))

    var position = state.getPosition()
    assert.deepStrictEqual(position, new THREE.Vector3(0, 0, 0))

    state.advance()

    direction = state.getDirectionVector()
    assert.deepStrictEqual(direction, new THREE.Vector3(0, 1, 0))

    position = state.getPosition()
    assert.deepStrictEqual(position, new THREE.Vector3(0, 1, 0))
  })

});

describe('Turtle', () => {

  describe('should update state when', () => {

    var state;
    var turtle;
    
    beforeEach(() => {
      state = State.build(0)
      turtle = new Turtle(state)
    })
    
    it('yaw RIGHT', () => {
      var updateSpy = sinon.spy(state, 'update');
      var setArmedSpy = sinon.spy(state, 'setArmed')
      turtle.yaw('RIGHT')
      assert.equal(updateSpy.calledWith('yaw', 'RIGHT'), true)
      assert.equal(setArmedSpy.calledWith(false), true)
    })

    it('yaw LEFT', () => {
      var updateSpy = sinon.spy(state, 'update');
      var setArmedSpy = sinon.spy(state, 'setArmed')
      turtle.yaw('LEFT')
      assert.equal(updateSpy.calledWith('yaw', 'LEFT'), true)
      assert.equal(setArmedSpy.calledWith(false), true)
    })
  
    it('roll RIGHT', () => {
      var updateSpy = sinon.spy(state, 'update');
      turtle.roll('RIGHT')
      assert.equal(updateSpy.calledWith('roll', 'RIGHT'), true)
    })
  
    it('roll LEFT', () => {
      var updateSpy = sinon.spy(state, 'update');
      turtle.roll('LEFT')
      assert.equal(updateSpy.calledWith('roll', 'LEFT'), true)
    })
  
    it('pitch UP', () => {
      var updateSpy = sinon.spy(state, 'update');
      var setArmedSpy = sinon.spy(state, 'setArmed')
      turtle.pitch('UP')
      assert.equal(updateSpy.calledWith('pitch', 'UP'), true)
      assert.equal(setArmedSpy.calledWith(false), true)
    })

    it('pitch DOWN', () => {
      var updateSpy = sinon.spy(state, 'update');
      var setArmedSpy = sinon.spy(state, 'setArmed')
      turtle.pitch('DOWN')
      assert.equal(updateSpy.calledWith('pitch', 'DOWN'), true)
      assert.equal(setArmedSpy.calledWith(false), true)
    })
  })

  describe('should update state, states and workingEdges', () => {

    var state;
    var turtle;
    
    beforeEach(() => {
      state = State.build(0)
      turtle = new Turtle(state)

      sinon.stub(state, 'getPosition').returns(new THREE.Vector3(0, 0, 0));
      sinon.stub(state, 'getQuaternion').returns( new THREE.Quaternion());
      sinon.stub(state, 'getQuaternions').returns({
        'yaw': {
          RIGHT: new THREE.Quaternion(0),
          LEFT: new THREE.Quaternion(1)
        },
        'roll': {
          RIGHT: new THREE.Quaternion(0, 0),
          LEFT: new THREE.Quaternion(1, 1)
        },
        'pitch': {
          UP: new THREE.Quaternion(0, 0, 0),
          DOWN: new THREE.Quaternion(1, 1, 1)
        } }
      );

    })

    it('when stacking', () => {
      var setArmedSpy = sinon.spy(state, 'setArmed')
    
      const [ workingEdge ] = turtle.workingEdges
      assert.deepEqual(workingEdge, [new THREE.Vector3(0, 0, 0)])

      assert.deepEqual(turtle.states, [])
      turtle.stack()
      assert.equal(setArmedSpy.calledWith(false), true)
      assert.equal(turtle.states.length, 1)
      const [ expectedState ] = turtle.states

      assert.deepEqual(expectedState.getDirectionVector(), state.getDirectionVector())
      assert.deepEqual(expectedState.getPosition(), state.getPosition())
      assert.deepEqual(expectedState.getQuaternions(), state.getQuaternions())
      assert.deepEqual(expectedState.getQuaternion(), state.getQuaternion())

      const [ updatedWorkingEdge ] = turtle.workingEdges
      assert.deepEqual(updatedWorkingEdge, [new THREE.Vector3(0, 0, 0)])
    })

    it('when unstacking', () => {
      turtle.stack()
      const [ initialState ] = turtle.states

      assert.deepEqual(initialState.getDirectionVector(), state.getDirectionVector())
      assert.deepEqual(initialState.getPosition(), state.getPosition())
      assert.deepEqual(initialState.getQuaternions(), state.getQuaternions())
      assert.deepEqual(initialState.getQuaternion(), state.getQuaternion())

      turtle.unstack()
      assert.deepEqual(turtle.states, [])
    })

  })

  describe('when draw it', () => {

    var state;
    var turtle;

    beforeEach(() => {
      state = State.build(0)
      turtle = new Turtle(state)
    })

    it('should advance', () => {
      const advanceSpy = sinon.spy(state, 'advance')
      
      turtle.draw()

      assert.equal(advanceSpy.calledOnce, true)
    })

    it('should update the bounding boxes', () => {
      sinon.stub(state, 'getPosition').returns(new THREE.Vector3(-1, -1, -1));
          
      assert.deepEqual(turtle.boundingBox, { x: { min: 0, max: 0 }, y: { min: 0, max: 0 }, z: { min: 0, max: 0 } })

      turtle.draw()

      assert.deepEqual(turtle.boundingBox, { x: { min: -1, max: 0 }, y: { min: -1, max: 0 }, z: { min: -1, max: 0 } })
    })

    it('should pop workingEdges if armed and push position', () => {
      sinon.stub(state, 'getPosition').returns(new THREE.Vector3(-9, -9, -9));
      sinon.stub(state, 'isArmed').returns(true)

      assert.deepEqual(turtle.workingEdges, [ [new THREE.Vector3(0, 0, 0)] ])
      turtle.draw()
      assert.deepEqual(turtle.workingEdges, [ [new THREE.Vector3(-9, -9, -9)] ])

    })

    it('should arm if not armed', () => {
      sinon.stub(state, 'isArmed').returns(false)

      assert.deepEqual(state.armed, false)
      turtle.draw()
      assert.deepEqual(state.armed, true)

    })

    it('should push current position into workingVectors, pop workingEdges and push the result into edges', () => {
      sinon.stub(state, 'isArmed').returns(false)
      assert.deepEqual(turtle.workingEdges, [ [new THREE.Vector3(0, 0, 0)] ])
      turtle.draw()
      assert.deepEqual(turtle.workingEdges, [ [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0)] ])
      assert.deepEqual(turtle.getEdges(), [ [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0)] ])
    })

    it('should update the center', () => {
      sinon.stub(state, 'getPosition').returns(new THREE.Vector3(1, 1, 1));
      sinon.stub(state, 'isArmed').returns(false)

      assert.deepEqual(turtle.getCenter(), null)
      turtle.draw()
      assert.deepEqual(turtle.getCenter(), new THREE.Vector3(0.5, 0.5, 0.5) )
    })

    it('should update the radius', () => {
      sinon.stub(state, 'getPosition').returns(new THREE.Vector3(1, 1, 1));
      sinon.stub(state, 'isArmed').returns(false)

      assert.deepEqual(turtle.getRadius(), null)
      turtle.draw()
      assert.deepEqual(turtle.getRadius(), 0.8660254037844386 )
    })

  })

})