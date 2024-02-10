import { CanvasModel } from "./canvasModel.js";
class BallModel extends CanvasModel {
	constructor() {
		super();
		this.trackSection = 0;// Текущий сегмент трека
		this.ballsColor = this.colors;// Цвета шариков
		this.width = this.canvasWidth;// Ширина холста
		this.height = this.canvasHeight;// Высота холста
		this.color = 0;// Индекс текущего цвета шарика
		this.getRandomColor();
	}

	createPosition(index) {
		this.trackSection = index;// Установка текущего сегмента трека
		this.x = this.track[this.trackSection].x;// Координата X шарика
		this.y = this.track[this.trackSection].y;// Координата Y шарика
	}

	// Получение случайного цвета для шарика
	getRandomColor() {
		let randomColor = Math.floor(Math.random() * this.colors.length);
		this.color = this.colors[randomColor];
	}

	// Возврат текущего сегмента трека
	getTrackSection() {
		return this.trackSection;
	}

	update(speed) {
		let index = this.trackSection + speed;// Вычисление нового сегмента трека
		this.createPosition(index);// Создание позиции для нового сегмента трека
	}
}
export { BallModel };