import { FireBall_MP3 } from '../../sound.js';
import { FrogModel } from "../model/frogModel.js";
import { FrogView } from "../view/frogView.js";

class FrogController {
	constructor() {
		this.model = new FrogModel();
		this.view = new FrogView(this.model);
		this.moveFrog();
		this.shot();
		this.swapColor();
	}

	// Обработка движения лягушки
	moveFrog() {
		let canvas = document.getElementById('canvas');

		canvas.addEventListener('mousemove', (eo) => {
			// Обработка события перемещения мыши на холсте
			let clientX = eo.clientX - canvas.getBoundingClientRect().x;// Получение горизонтальной позиции указателя мыши относительно холста
			let clientY = eo.clientY - canvas.getBoundingClientRect().y;// Получение вертикальной позиции указателя мыши относительно холста

			this.model.updateFrogAngle(clientX, clientY);// Обновление угла лягушки в модели на основе позиции мыши
			if (this.model.shotState === 0) {
				this.model.updateShotAngle(clientX, clientY);// Обновление угла выстрела в модели на основе позиции мыши, если выстрел не активен
			}
		});
	}

	// Обработка выстрела
	shot() {
		let canvas = document.getElementById('canvas');

		canvas.addEventListener('click', (eo) => {
			// Обработка события клика на холсте
			if (!this.model.shotState && this.model.canShoot) {
				// Проверка, что выстрел не активен и лягушка может стрелять
				this.model.shotSpeed = this.model.frogWidth / 10;// Установка скорости выстрела на основе ширины лягушки
				this.model.shotState = 1;// Активация выстрела
				this.fireSound().play();
			}
		});
	}

	// Воспроизведение звука выстрела
	fireSound() {
		let fireSound = new Audio();
		fireSound.src = FireBall_MP3;
		return fireSound;
	}

	// Перезапуск выстрела
	restartShot() {
		let canvas = document.getElementById('canvas');
		let offsetLeft = (canvas.offsetWidth);
		let offsetTop = (canvas.offsetHeight);

		if (this.model.shotLeft - this.model.shotRadius < canvas.offsetLeft - offsetLeft ||
			this.model.shotTop - this.model.shotRadius < canvas.offsetTop - offsetTop ||
			this.model.shotLeft + this.model.shotRadius > canvas.offsetWidth ||
			this.model.shotTop + this.model.shotRadius > canvas.offsetHeight) {// Проверка, что выстрел вышел за границы холста
			this.model.restartShot();// Перезапуск выстрела в модели
			this.view.secondColor = this.model.secondShotColor;
			this.view.color = this.model.color;
		}
	}

	// Остановка выстрела
	stopShot() {
		if (this.model.down === 1) {
			this.model.stopShot();// Остановка выстрела 
			this.view.secondColor = this.model.secondShotColor;// Обновление вторичного цвета
			this.view.color = this.model.color;// Обновление цвета
		}
	}

	// Смена цвета
	swapColor() {
		window.oncontextmenu = function (eo) {
			return false;
		}// Отключение контекстного меню на странице

		window.addEventListener('mousedown', (eo) => {// Обработка события нажатия кнопки мыши
			if (eo.button === 2) {
				// Проверка, что нажата правая кнопка мыши
				let firstColor = this.model.color;// Запоминание первого цвета
				let secondColor = this.model.secondShotColor;// Запоминание второго цвета

				this.model.color = secondColor;// Установка второго цвета в модели
				this.model.secondShotColor = firstColor;// Установка первого цвета вторичного выстрела в модели
				this.view.color = secondColor;// Обновление цвета в представлении
				this.view.secondColor = firstColor;// Обновление вторичного цвета в представлении
			}
		});
	}

	// Отрисовка
	draw() {
		this.stopShot();
		this.restartShot();
		this.view.draw();
		this.model.updateShot()
	}
}
export { FrogController };