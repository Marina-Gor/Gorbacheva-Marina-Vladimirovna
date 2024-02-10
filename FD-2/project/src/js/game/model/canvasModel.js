import { data } from "../data.js";
import { Track } from "../track.js";

class CanvasModel {
	constructor() {
		this.track = new Track().getTrack();// Получение трека из класса Track
		this.levelBg = data.levelBg;// Фон уровня
		this.colors = data.ballsColor;// Цвета шаров
		this.totalBalls = data.totalBalls;// Общее количество шаров
		this.ratio = 4 / 3;// Соотношение сторон
		this.canvasWidth = 600;
		this.canvasHeight = 400;
		this.frog = this.createFrog();// Создание объекта для лягушки
		this.shot = this.createShot();// Создание объекта для выстрела
		this.ballRadius = this.createBall();// Радиус шара
		this.track = this.createTrack();// Создание трека
	}

	// Создание радиуса шара
	createBall() {
		return this.canvasWidth / 70;
	}

	// Создание объекта для выстрела
	createShot() {
		return {
			radius: this.canvasWidth / 70,// Радиус выстрела
			left: this.canvasWidth / data.offsetFrogLeft + this.canvasWidth / 6.15 / 2,// Позиция выстрела по горизонтали
			top: this.canvasHeight / data.offsetFrogTop + this.canvasWidth / 6.15 / 2,// Позиция выстрела по вертикали
		}
	}

	// Создание объекта для лягушки
	createFrog() {
		return {
			width: this.canvasWidth / 6.15,// Ширина лягушки
			height: this.canvasWidth / 6.15,// Высота лягушки
			left: this.canvasWidth / data.offsetFrogLeft,// Позиция лягушки по горизонтали
			top: this.canvasHeight / data.offsetFrogTop,// Позиция лягушки по вертикали
		}
	}

	// Создание трека
	createTrack() {
		let track = this.track;// Исходный трек
		let ratioW = this.canvasWidth / 1280;// Коэффициент масштабирования по горизонтали
		let ratioH = this.canvasHeight / 820;// Коэффициент масштабирования по вертикали
		let newtrack = [];

		for (let i = 0; i < track.length; i++) {
			// Масштабирование координат трека
			newtrack.push({ x: track[i].x * ratioW, y: track[i].y * ratioH });
		}
		return newtrack;// Возвращение нового масштабированного трека
	}
}
export { CanvasModel };