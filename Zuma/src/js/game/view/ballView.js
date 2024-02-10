import { CanvasView } from "./canvasView.js";

class BallView extends CanvasView {
	frame = 0;// Текущий кадр анимации
	numberOfRows = 10;// Общее количество строк спрайта
	numberOfCols = 6;// Общее количество столбцов спрайта
	tickPerFrame = 1;// Количество тиков до обновления кадра
	tickCount = 0;// Счетчик тиков
	spriteWidth = 300;// Ширина спрайта
	spriteHeight = 180;// Высота спрайта
	rowCount = 0;// Текущая строка спрайта

	constructor(model) {
		super();
		this.model = model;
		this.color = this.model.color;
	}

	//Отрисовка шара
	drawBall() {
		let ballImage = new Image();
		ballImage.src = this.color;
		this.context.save();
		this.context.beginPath();
		this.context.arc(
			this.model.x, this.model.y,
			this.model.ballRadius, 0, Math.PI * 2, false
		);

		this.context.closePath();
		this.context.clip();
		this.animateColor(ballImage);
		this.context.restore();
	}

	// Рисование спрайта изображения с использованием текущего кадра и строк
	animateColor(image) {
		this.context.translate(this.model.x - this.model.ballRadius, this.model.y - this.model.ballRadius);

		this.context.drawImage(
			image,
			this.frame * this.spriteWidth / this.numberOfRows,
			this.rowCount * this.spriteHeight / this.numberOfCols,
			this.spriteWidth / this.numberOfRows, this.spriteHeight,
			0, 0,
			this.model.ballRadius * 2 * 10 / this.numberOfRows, this.model.ballRadius * 2 * 6
		);

		if (this.tickCount > this.tickPerFrame) {
			this.tickCount = 0;

			if (this.frame === this.numberOfRows - 1) {
				this.rowCount++;
			}

			if (this.rowCount === 6) {
				this.rowCount = 0;
			}
			this.frame = (this.frame < this.numberOfRows - 1) ? this.frame += 1 : this.frame = 0;
		}

		this.tickCount++;
	}

	// Рисование шарика
	draw() {
		this.drawBall()
	}
}
export { BallView }