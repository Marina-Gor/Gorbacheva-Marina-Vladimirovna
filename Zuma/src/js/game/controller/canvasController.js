import { CanvasModel } from "../model/canvasModel.js";
import { CanvasView } from "../view/canvasView.js";
import { FrogController } from "./frogController.js";
import { BallController } from "./ballController.js";

class CanvasController {
	constructor() {
		this.game = new CanvasModel();
		this.view = new CanvasView(this.game);
		this.frogController = new FrogController();
		this.ballController = new BallController(this.game.totalBalls, this.frogController.model);
		this.view.createCanvas();
	}

	// Метод для отрисовки элементов на холсте
	draw() {
		this.view.draw();
		this.ballController.draw();
		console.log("я тут")
		this.frogController.draw();
	}
}
export { CanvasController };