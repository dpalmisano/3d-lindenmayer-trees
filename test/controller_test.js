const assert = require('assert');
const sinon = require('sinon');

var { Controller } = require('../turtle3d/controller.js')

describe('Controller', () => {

    var controller;

    var addEventListenerSpy;
    var moveCameraSpy;
    var zoomInSpy;
    var zoomOutSpy;

    beforeEach(() => {
        moveCameraSpy = sinon.spy();
        zoomInSpy = sinon.spy();
        zoomOutSpy = sinon.spy();
        const sceneMock = {
            moveCamera: moveCameraSpy,
            zoomIn: zoomInSpy,
            zoomOut: zoomOutSpy
        };

        addEventListenerSpy = sinon.spy();
        const elementMock = {
            getBoundingClientRect: sinon.stub().returns({ left: 0, top: 10 }),
            addEventListener: addEventListenerSpy
        }
        controller = new Controller(sceneMock, elementMock);
    })

    it('constructor should add needed eventListeners', () => {
        assert.equal(addEventListenerSpy.getCall(0).firstArg, 'mousedown');
        assert.equal(addEventListenerSpy.getCall(1).firstArg, 'mousemove');
        assert.equal(addEventListenerSpy.getCall(2).firstArg, 'mouseup');
    });


    it('mouseDown and mouseUp should start and stop dragging', () => {
        assert.equal(controller.dragging.isDragging, false);
        controller.mouseDown({ x: 0, y: 0 });
        assert.equal(controller.dragging.isDragging, true);
        controller.mouseUp({ x: 5, y: 5 });
        assert.equal(controller.dragging.isDragging, false);
    });

    it('mouseDown, mouseMove, mouseUp should move the camera', () => {
        controller.mouseDown({ x: 0, y: 0 });
        controller.mouseMove({ x: 2.5, y: 2.5 });
        controller.mouseUp({ x: 5, y: 5 });

        sinon.assert.calledWith(moveCameraSpy, 2.5, 2.5);
    });

    it('mouseScroll should call zoomIn', () => {
        controller.mouseScroll({ deltaY: -1, preventDefault: () => {} });
        sinon.assert.called(zoomInSpy);
    })

    it('mouseScroll should call zoomOut', () => {
        controller.mouseScroll({ deltaY: 1, preventDefault: () => {} });
        sinon.assert.called(zoomOutSpy);
    })

})