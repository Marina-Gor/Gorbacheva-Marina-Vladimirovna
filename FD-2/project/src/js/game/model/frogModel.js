import { CanvasModel } from "./canvasModel.js";
class FrogModel extends CanvasModel {
	constructor() {
		super();
		this.frogAngle = 0;
		this.shotSpeed = 0;
		this.shotAngle = 0;
		this.shotState = 0;
		this.down = 0;

		this.shotRadius = this.shot.radius;// Радиус выстрела
		this.shotLeft = this.shot.left;// Горизонтальная позиция выстрела
		this.shotTop = this.shot.top;// Вертикальная позиция выстрела
		this.color = 0;
		this.canShoot = false;

		this.secondShotLeft = this.shot.left;// Горизонтальная позиция вторичного выстрела
		this.secondShotTop = this.shot.top;// Вертикальная позиция вторичного выстрела
		this.secondShotColor = 0;

		this.frogWidth = this.frog.width;
		this.frogHeight = this.frog.height;
		this.frogLeft = this.frog.left;// Горизонтальная позиция лягушки
		this.frogTop = this.frog.top;// Вертикальная позиция лягушки

		this.getRandomColor();
		this.getRandomSecondShotColor();
	}

	// Получение случайного цвета
	getRandomColor() {
		let randomColor = Math.floor(Math.random() * this.colors.length);// Генерация случайного индекса цвета в пределах массива цветов
		this.color = this.colors[randomColor];
	}

	// Получение случайного цвета для вторичного выстрела
	getRandomSecondShotColor() {
		let randomColor = Math.floor(Math.random() * this.colors.length);
		this.secondShotColor = this.colors[randomColor];
	}

	// Вычисление угла лягушки на основе позиции мыши и позиции лягушки
	updateFrogAngle(x, y) {
		this.frogAngle = Math.atan2(
			-(x - (this.frogLeft + this.frogWidth / 2)),
			(y - (this.frogTop + this.frogHeight / 2))
		);
	}

	// Вычисление угла выстрела на основе позиции мыши и позиции лягушки
	updateShotAngle(x, y) {
		this.shotAngle = Math.atan2(
			(x - (this.frogLeft + this.frogWidth / 2)),
			(y - (this.frogTop + this.frogHeight / 2))
		);
	}

	// Обновление горизонтальной и вертикальной позиции выстрела на основе угла и скорости
	updateShot() {
		this.shotLeft += Math.sin(this.shotAngle) * this.shotSpeed;
		this.shotTop += Math.cos(this.shotAngle) * this.shotSpeed;
	}

	stopShot() {
		this.shotState = 0;// Остановка выстрела
		this.shotSpeed = 0;// Обнуление скорости выстрела
		this.shotAngle = -this.frogAngle;// Обновление угла выстрела на противоположный угол лягушки
		this.shotLeft = this.frogLeft + this.frogWidth / 2;
		this.shotTop = this.frogTop + this.frogHeight / 2;
		this.down = 0;
		this.color = this.secondShotColor;

		this.getRandomSecondShotColor();

		if (this.colors.length === 1) {
			this.color = this.secondShotColor;

			this.getRandomSecondShotColor();
		}
	}

	restartShot() {
		this.shotSpeed = 0;
		this.shotState = 0;
		this.shotAngle = -this.frogAngle;
		this.shotLeft = this.frogLeft + this.frogWidth / 2;
		this.shotTop = this.frogTop + this.frogHeight / 2;
		this.color = this.secondShotColor;

		this.getRandomSecondShotColor();
	}
}
export { FrogModel };