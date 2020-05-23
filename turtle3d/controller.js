class Controller {

    constructor(scene, element) {
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

    mouseDown(event) {
        this.startDragging(event.x - this.canvasRect.left, event.y - this.canvasRect.top);
    }

    mouseMove(event) {
        this.drag(event.x - this.canvasRect.left, event.y - this.canvasRect.top)
    }

    mouseUp() {
        this.stopDragging();
    }

    mouseScroll(event) {
        event.preventDefault();
        const { deltaY } = event;
        if(deltaY < 0) {
            this.scene.zoomIn();
        } else {
            this.scene.zoomOut();
        }
    }

    startDragging(x, y) {
        this.dragging = {
            isDragging: true,
            x: x,
            y: y
        }
    }

    stopDragging() {
        this.dragging.isDragging = false;
    }

    drag(x, y) {
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

module.exports = { Controller }