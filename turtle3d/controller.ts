import { Scene } from './meshAssembler';

export class Controller {
    scene: Scene;
    element: HTMLElement;
    canvasRect: DOMRect;
    dragging: {
        isDragging: boolean,
        x?: number,
        y?: number
    }

    constructor(scene: Scene, element: HTMLElement) {
        this.scene = scene;
        this.element = element;
        this.canvasRect = element.getBoundingClientRect();
        this.dragging = {
            isDragging: false
        };
        this.initMove();
    }

    initMove() {
        this.element.addEventListener("mousedown", this.mouseDown.bind(this));
        this.element.addEventListener("mousemove", this.mouseMove.bind(this));
        this.element.addEventListener("mouseup", this.mouseUp.bind(this));

        this.element.addEventListener("wheel", this.mouseScroll.bind(this));
    }

    mouseDown(event: MouseEvent) {
        this.startDragging(event.x - this.canvasRect.left, event.y - this.canvasRect.top);
    }

    mouseMove(event: MouseEvent) {
        this.drag(event.x - this.canvasRect.left, event.y - this.canvasRect.top)
    }

    mouseUp() {
        this.stopDragging();
    }

    mouseScroll(event: MouseWheelEvent) {
        event.preventDefault();
        const { deltaY } = event;
        if(deltaY < 0) {
            this.scene.zoomIn();
        } else {
            this.scene.zoomOut();
        }
    }

    startDragging(x: number, y: number) {
        this.dragging = {
            isDragging: true,
            x: x,
            y: y
        }
    }

    stopDragging() {
        this.dragging.isDragging = false;
    }

    drag(x: number, y: number) {
        const { isDragging } = this.dragging;
        if(isDragging) {
            var deltaX = x - this.dragging.x;
			var deltaY = y - this.dragging.y;
			
			this.dragging.x = x;
			this.dragging.y = y;
			
			this.scene.moveCamera(deltaX, deltaY);
		}
    }
}