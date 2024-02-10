import { frog } from '../../pictures';
import { CanvasView } from "./canvasView.js";
class FrogView extends CanvasView {
	frame = 0;//Текущий кадр анимации
	numberOfRows = 10;// Количество строк в спрайт-листе для анимации
	numberOfCols = 6;// Количество столбцов в спрайт-листе для анимации
	tickPerFrame = 1;// Количество тиков до переключения кадра анимации
	tickCount = 0;// Текущее количество тиков для анимации
	spriteWidth = 300;// Ширина спрайта анимации
	spriteHeight = 180; // Высота спрайта анимации
	rowCount = 0;// Текущий номер строки спрайта для анимации

	constructor(model) {
		super();
		this.model = model;
		this.color = this.model.color;
		this.secondColor = this.model.secondShotColor;
	}

	//Орисовка лягушки
	drawFrog() {
		let frogImage = new Image();
		frogImage.src = frog;

		this.context.save();
		this.context.beginPath();

		this.context.arc(
			this.model.frogLeft + this.model.frogWidth / 2,
			this.model.frogTop + this.model.frogHeight / 2,
			this.model.frogWidth / 2, 0, Math.PI * 2, false
		);

		this.context.closePath();
		this.context.clip();

		this.context.translate(
			this.model.frogLeft + this.model.frogWidth / 2,
			this.model.frogTop + this.model.frogHeight / 2
		);

		this.context.rotate(this.model.frogAngle);// Поворот контекста рисования на угол лягушки

		this.context.drawImage(
			frogImage,
			-this.model.frogWidth / 2, -this.model.frogHeight / 2,
			this.model.frogWidth, this.model.frogHeight
		);

		this.context.restore();
	}

	//Отрисовка выстрела
	drawShot() {
		let shotImage = new Image();
		shotImage.src = this.color;

		this.context.save();
		this.context.beginPath();

		this.context.arc(
			this.model.frogLeft + this.model.frogWidth / 2,
			this.model.frogTop + this.model.frogHeight / 2,
			this.model.frogWidth / 2, 0, Math.PI * 2, false
		);
		this.context.closePath();

		this.context.translate(
			this.model.shotLeft, this.model.shotTop
		);

		this.context.rotate(-this.model.shotAngle);

		this.context.beginPath();
		this.context.arc(
			0,
			this.model.frogHeight / 4,
			this.model.shotRadius, 0, Math.PI * 2, true)
		this.context.closePath();
		this.context.clip()

		this.animateColor(shotImage);
		this.context.restore();
	}

	// Рисование спрайта изображения с использованием текущего кадра и строк
	animateColor(image) {
		this.context.translate(0, 0);

		this.context.drawImage(
			image,
			this.frame * this.spriteWidth / this.numberOfRows, this.rowCount * this.spriteHeight / this.numberOfCols,
			this.spriteWidth / this.numberOfRows, this.spriteHeight,
			-this.model.shotRadius, -this.model.shotRadius + this.model.frogHeight / 4,
			this.model.shotRadius * 2 * 10 / this.numberOfRows, this.model.shotRadius * 2 * 6
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

	//Отрисовка вотрого шара
	drawSecondBall() {
		let shotImage = new Image();
		shotImage.src = this.secondColor;
		this.context.save();
		this.context.beginPath();

		this.context.arc(
			this.model.frogLeft + this.model.frogWidth / 2,
			this.model.frogTop + this.model.frogHeight / 2,
			this.model.frogWidth / 2 + 2, 0, Math.PI * 2, false
		);

		this.context.closePath();

		this.context.translate(
			this.model.secondShotLeft, this.model.secondShotTop
		);

		this.context.rotate(this.model.frogAngle);

		this.context.beginPath();
		this.context.arc(
			0,
			-this.model.frogHeight / 5,
			this.model.shotRadius / 2 + 1, 0, Math.PI * 2, false)
		this.context.closePath();
		this.context.clip();
		this.context.fill();


		this.context.translate(0, 0);

		this.context.drawImage(
			shotImage,
			0, 0,
			30, 30,
			-this.model.shotRadius / 2 - 2, -this.model.frogHeight / 5 - this.model.shotRadius / 2 - 1,
			this.model.shotRadius + 3, this.model.shotRadius + 3
		);

		this.context.restore();
	}

	draw() {
		this.drawFrog();
		this.drawShot();
		this.drawSecondBall();
	}
}
export { FrogView }