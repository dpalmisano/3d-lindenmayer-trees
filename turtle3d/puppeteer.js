

class Puppeteer {

    constructor(symbols, turtle, meshAssembler) {
        this.symbols = symbols
        this.turtle = turtle
        this.meshAssembler = meshAssembler
    }

    processSymbol(symbol) {
        switch(symbol) {
            case "[":
                this.turtle.stack();
                break;
            case "]":
                this.turtle.unstack();
                break;
            case "+":
                this.turtle.yaw('RIGHT')
				break;
			case "-":
			    this.turtle.yaw('LEFT')
			    break;
			case "/":
				this.turtle.roll('RIGHT')
				break;
			case "\\":
				this.turtle.roll('LEFT')
				break;
			case "^":
				this.turtle.pitch('UP')
				break;
			case "_":
				this.turtle.pitch('DOWN')
                break;
            default:
                this.turtle.draw();
                break;
        }
    }

    play() {
        this.symbols.forEach(symbol => {
            this.processSymbol(symbol)
        });
        const vectors = this.turtle.getEdges()
        return {
            'mesh': this.meshAssembler.getMesh(vectors),
            'center': this.turtle.getCenter(),
            'radius': this.turtle.getRadius()
        }
    }


}

module.exports = { Puppeteer }