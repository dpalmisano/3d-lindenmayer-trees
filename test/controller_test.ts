import * as assert from 'assert';
import * as sinon from 'sinon';

import { Controller } from '../turtle3d/controller'
import { Scene } from '../turtle3d/meshAssembler';

describe('Controller', () => {

    var controller: Controller;

    var addEventListenerSpy;
    var moveCameraSpy;
    var zoomInSpy;
    var zoomOutSpy;

    beforeEach(() => {
        moveCameraSpy = sinon.spy();
        zoomInSpy = sinon.spy();
        zoomOutSpy = sinon.spy();
        const sceneMock: Scene = <Scene> <any> sinon.mock(Scene);
        sceneMock.moveCamera = moveCameraSpy;
        sceneMock.zoomIn = zoomInSpy;
        sceneMock.zoomOut = zoomOutSpy;
  
        addEventListenerSpy = sinon.spy();
        const elementMock: HTMLElement = <HTMLElement> <any> sinon.mock(HTMLElement);
        elementMock.getBoundingClientRect = sinon.stub().returns({ left: 0, top: 10 });
        elementMock.addEventListener = addEventListenerSpy;

        controller = new Controller(sceneMock, elementMock);
    })

    it('constructor should add needed eventListeners', () => {
        assert.equal(addEventListenerSpy.getCall(0).firstArg, 'mousedown');
        assert.equal(addEventListenerSpy.getCall(1).firstArg, 'mousemove');
        assert.equal(addEventListenerSpy.getCall(2).firstArg, 'mouseup');
    });


    it('mouseDown and mouseUp should start and stop dragging', () => {
        assert.equal(controller.dragging.isDragging, false);
        // @ts-ignore
        controller.mouseDown({ x: 0, y: 0 });
        assert.equal(controller.dragging.isDragging, true);
        // @ts-ignore
        controller.mouseUp({ x: 5, y: 5 });
        assert.equal(controller.dragging.isDragging, false);
    });

    it('mouseDown, mouseMove, mouseUp should move the camera', () => {
        // @ts-ignore
        controller.mouseDown({ x: 0, y: 0 });
        // @ts-ignore
        controller.mouseMove({ x: 2.5, y: 2.5 });
        // @ts-ignore
        controller.mouseUp({ x: 5, y: 5 });

        sinon.assert.calledWith(moveCameraSpy, 2.5, 2.5);
    });

    it('mouseScroll should call zoomIn', () => {
        // @ts-ignore
        controller.mouseScroll({ deltaY: -1, preventDefault: () => {} });
        sinon.assert.called(zoomInSpy);
    })

    it('mouseScroll should call zoomOut', () => {
        // @ts-ignore
        controller.mouseScroll({ deltaY: 1, preventDefault: () => {} });
        sinon.assert.called(zoomOutSpy);
    })

})