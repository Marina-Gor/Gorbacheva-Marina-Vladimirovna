import { data } from "./data.js";
import { Bezier } from "./bezier.js";

class Track {
	constructor() {
		this.track = [];// Массив для хранения точек трека
	}

	// Создание объекта точки с координатами x и y
	getPoint(x, y) {
		return { x, y };
	}

	// Получение точек трека
	getPoints() {
		let mapCurve = data.points;// Получение кривой трека из data.points

		let bezier = new Bezier();// Создание экземпляра класса Bezier для работы с кривыми Безье

		for (let i = 0; i < mapCurve.length - 2; ++i) {
			// Вычисление точек для кривой Безье
			let point0 = (i === 0) ? this.getPoint(mapCurve[0].x, mapCurve[0].y) :
				this.getPoint((mapCurve[i].x + mapCurve[i + 1].x) / 2,
					(mapCurve[i].y + mapCurve[i + 1].y) / 2);

			let point1 = this.getPoint(mapCurve[i + 1].x, mapCurve[i + 1].y);

			let point2 = (i <= mapCurve.length - 4) ? this.getPoint((mapCurve[i + 1].x + mapCurve[i + 2].x) / 2,
				(mapCurve[i + 1].y + mapCurve[i + 2].y) / 2) :
				this.getPoint(mapCurve[i + 2].x, mapCurve[i + 2].y);

			let steps = bezier.init(point0, point1, point2, 1);// Инициализация кривой Безье и получение шага движения

			for (let m = 1; m <= steps; ++m) {
				let data = bezier.getAnchorPoint(m);// Получение якорной точки на кривой Безье

				this.track.push(data);// Добавление точки в массив трека
			}
		}
	};

	// Получение трека
	getTrack() {
		this.getPoints();// Получение точек трека
		return this.track;// Возвращение массива трека
	}
}

export { Track }