class CanvasView {
	constructor(model) {
		this.model = model;
		this.context = document.getElementById('canvas').getContext('2d');// Получение контекста рисования 2D для холста с идентификатором 'canvas'
	}

	// Создание холста
	createCanvas() {
		let canvas = document.getElementById('canvas');// Получение элемента холста с идентификатором 'canvas'
		canvas.width = this.model.canvasWidth;// Установка ширины холста из модели
		canvas.height = this.model.canvasHeight;// Установка высоты холста из модели
	}

	// Отрисовка элементов на холсте
	draw() {
		let levelBg = new Image();
		levelBg.src = this.model.levelBg;// Загрузка изображения фона уровня из модели
		this.context.drawImage(levelBg, 0, 0, this.model.canvasWidth, this.model.canvasHeight);// Отрисовка фона уровня на холсте
	}
}
export { CanvasView }