import { Main_MP3 } from '../../sound.js';
import { FireBall_MP3 } from '../../sound.js';
import { BallModel } from "../model/ballModel.js";
import { BallView } from "../view/ballView.js";
import { Player } from "../player.js";

class BallController {
	constructor(totalBalls, frog) {
		this.frog = frog;// Объект-лягушка
		this.totalBalls = totalBalls;// Общее количество шаров
		this.player = new Player();// Объект игрока
		this.balls = [];// Массив шаров
		this.spacing = 36;// Расстояние между шарами
		this.track = [];// Трек
		this.views = []; // Виды (отображения) шаров
		this.createFirstBall();// Создание первого шара
		this.gameEnd = false;// Флаг окончания игры
		this.ballNeedShift = false;// Флаг необходимости сдвига шаров
		this.shiftedBalls = [];// Массив сдвинутых шаров
		this.ballCounter = 0;// Счетчик шаров

		this.currentCombo = 0;// Текущая комбинация
		this.maxCombo = 0;// Максимальная комбинация
		this.comboCounter = 0;// Счетчик комбинаций

		this.checkUnload();// Проверка выгрузки
		this.music = this.createMusic();// Создание музыки
	}

	// Создание первого шара
	createFirstBall() {
		let ball = this.createRandomBall();
		let view = new BallView(ball);
		this.views.unshift(view);
		this.balls.unshift(ball);

		ball.createPosition(this.spacing);// Создание позиции шара на треке
		this.track = ball.track;// Присвоение трека шара переменной track
	}

	// Создание остальных шаров
	createBalls() {
		if (this.balls.length !== 0) {
			this.pushNextBall(0, 1);// Перемещение следующего шара на трек

			if (this.balls[0].getTrackSection() === this.spacing * 2 &&
				this.totalBalls !== 0 && this.totalBalls > 0
			) {
				let ball = this.createRandomBall();
				let view = new BallView(ball);
				this.views.unshift(view);
				this.balls.unshift(ball);// Добавление шара в начало массива шаров
				ball.createPosition(this.spacing); // Создание позиции шара на треке
			}
		}
	}

	createRandomBall() {
		this.totalBalls--;// Уменьшение общего количества шаров
		this.ballCounter++;// Увеличение счетчика шаров
		return new BallModel();// Создание нового объекта шара
	}

	pushBall(ball, pushPosition) {
		let index;

		for (let i = 0; i < this.balls.length; i++) {

			if (this.balls[i].trackSection > pushPosition) {
				index = i;
				break;
			}

			if (i === this.balls.length - 1) {
				index = i + 1;
			}
		}

		ball.createPosition(pushPosition);// Создание позиции шара на треке

		this.balls.splice(index, 0, ball);// Вставка шара в массив шаров на определенную позицию

		this.frog.colors = this.checkColor();// Проверка цвета лягушки
		let view = new BallView(ball);// Создание представления шара
		this.views.splice(index, 0, view);// Вставка представления в массив представлений на определенную позицию

		if (this.balls[index - 1] &&
			this.balls[index - 1].color === this.balls[index].color &&
			this.balls[index].getTrackSection() - this.balls[index - 1].getTrackSection() > this.spacing + 1) {
			this.addShiftedBall(ball);// Добавление шара в массив сдвинутых шаров
		}

		if (this.balls[index + 1] &&
			this.balls[index + 1].color === this.balls[index].color &&
			this.balls[index + 1].getTrackSection() - this.balls[index].getTrackSection() > this.spacing + 1) {
			this.addShiftedBall(this.balls[index + 1]);// Добавление следующего шара в массив сдвинутых шаров
		}

		this.checkTail(index, true);// Проверка хвоста
	}

	// Метод перемещает следующий шар на трек и обновляет позиции шаров
	pushNextBall(index, speed) {
		let tempBalls = [];
		tempBalls.push(this.balls[index]);// Временный массив для сохранения шаров

		// Перебираем шары, начиная с индекса
		for (let i = index; i < this.balls.length - 1; i++) {

			// Если расстояние между текущим и следующим шарами не превышает заданное расстояние
			if (this.balls[i + 1].getTrackSection() - this.balls[i].getTrackSection() <= this.spacing) {

				// Если расстояние между текущим и следующим шарами меньше заданного расстояния
				if (this.balls[i + 1].getTrackSection() - this.balls[i].getTrackSection() < this.spacing) {

					this.balls[i + 1].update(1);// Обновляем позицию следующего шара со скорость
				}

				tempBalls.push(this.balls[i + 1]);// Добавляем следующий шар во временный массив
			} else {
				break;// Прерываем цикл, если расстояние превышает заданное расстояние
			}
		}

		// Обновляем позиции шаров для смещения
		for (let i = this.balls.length - 1; i > 0; i--) {

			// Если расстояние между текущим и предыдущим шарами меньше заданного расстояния
			if (this.balls[i].getTrackSection() - this.balls[i - 1].getTrackSection() < this.spacing) {
				this.balls[i].update(1);// Обновляем позицию текущего шара со скоростью 
			}

		}

		// Обновляем позиции шаров во временном массиве
		for (let j = 0; j < tempBalls.length; j++) {
			tempBalls[j].update(speed);// Обновляем позицию шара со скоростью speed
		}

		// Проверяем, если последний шар достиг границы трека
		if (this.balls[this.balls.length - 1].getTrackSection() >= this.track.length - this.spacing) {
			this.balls.splice(this.balls.length - 2, 1);// Удаляем предпоследний шар


			if (this.balls.length === 2) {
				this.gameEnd = true;// Устанавливаем флаг окончания игры в true
				this.frog.canShoot = 0;// Отключаем возможность стрелять у лягушки
				this.music.main.pause();// Приостанавливаем воспроизведение основной музыки
			}
		}
	}

	// Метод проверяет столкновение снаряда с шарами на треке
	checkCollision(shot) {
		for (let i = 0; i < this.balls.length; i++) {

			let dx = this.balls[i].x - shot.x;
			let dy = this.balls[i].y - shot.y;
			let distance = Math.sqrt((dx * dx) + (dy * dy));

			// Если расстояние между шаром и снарядом меньше или равно удвоенному радиусу шара
			if (distance <= this.balls[i].ballRadius * 2) {
				this.frog.down = 1;// Устанавливаем флаг down для лягушки в 1
				return i;// Возвращаем индекс столкнувшегося шара
			}
		}
		return -1;// Возвращаем -1, если столкновение не произошло
	}

	// Метод проверяет позицию шара относительно других шаров на треке
	checkPosition(ball, index, position) {
		let pushPosition;

		if (position === 'next') {
			pushPosition = this.balls[index].getTrackSection();// Получаем позицию следующего шара
		} else if (position === 'previous') {
			pushPosition = this.balls[index].getTrackSection() - this.spacing;// Получаем позицию предыдущего шара с учетом заданного расстояния
		}
		this.pushBall(ball, pushPosition);// Вызываем метод pushBall для перемещения шара на заданную позицию
	}

	// Метод проверяет цвета шаров на треке и возвращает массив уникальных цветов
	checkColor() {
		let colorArray = [];

		for (let i = 0; i < this.balls.length; i++) {
			colorArray.push(this.balls[i].color);// Добавляем цвет каждого шара в массив
		}

		return Array.from(new Set(colorArray));// Возвращаем массив уникальных цветов
	}

	checkTail(index, status) {
		let tempBalls = [];// Временный массив для хранения шаров
		tempBalls.push(this.balls[index]);// Добавляем текущий шар во временный массив

		let color = this.balls[index].color;// Цвет текущего шара
		let i = index + 1;

		while (this.balls[i]) {// Пока есть следующий шар

			if (this.balls[i].color === color) {// Если цвет следующего шара совпадает с текущим

				if (this.balls[i].getTrackSection() - this.balls[i - 1].getTrackSection() <= this.spacing + 1) {// Если следующий шар находится на расстоянии не больше (spacing + 1) от предыдущего шара по треку
					tempBalls.push(this.balls[i]);// Добавляем следующий шар во временный массив
					i++;
				} else if (!status) {
					tempBalls.push(this.balls[i]);// Добавляем следующий шар во временный массив
					i++;
				} else {
					break;
				}
			} else {
				break;
			}
		}

		let j = index - 1;

		while (this.balls[j]) {// Пока есть предыдущий шар

			if (this.balls[j].color === color) {// Если цвет предыдущего шара совпадает с текущим

				if (this.balls[j + 1].getTrackSection() - this.balls[j].getTrackSection() <= this.spacing + 1) {// Если текущий шар находится на расстоянии не больше (spacing + 1) от следующего шара по треку
					tempBalls.push(this.balls[j]);// Добавляем текущий шар во временный массив
					j--;
				} else if (!status) {
					tempBalls.push(this.balls[j]);// Добавляем текущий шар во временный массив
					j--;
				} else {
					break;
				}
			} else {
				break;
			}
		}
		j++;

		if (tempBalls.length > 2 && status) {
			this.clearBalls(j, tempBalls);// Очищаем шары из массива balls и views
		}
		return tempBalls.length;// Возвращаем длину временного массива
	}

	clearBalls(index, tempBalls) {
		this.currentCombo++;// Увеличиваем счетчик текущей комбинации

		this.checkWinGame(tempBalls);// Проверяем, завершилась ли игра

		let tempScore = 0;

		for (let i = 0; i < tempBalls.length; i++) {
			tempScore += 10;// Увеличиваем временный счет на 10
		}

		this.player.score += tempScore;// Увеличиваем счет игрока на временный счет

		this.balls.splice(index, tempBalls.length);// Удаляем шары из массива balls
		this.views.splice(index, tempBalls.length);// Удаляем представления шаров из массива views

		if (!this.gameEnd) {
			this.frog.colors = this.checkColor();// Проверяем цвета шаров для лягушки
		}

		if (this.balls[index - 1] &&
			this.balls[index] &&
			this.balls[index - 1].color === this.balls[index].color
		) {
			if (this.checkTail(index, false) < 3) {// Если длина хвоста меньше 3
				if (this.currentCombo > this.maxCombo) {
					this.maxCombo = this.currentCombo;// Устанавливаем максимальную комбинацию
				}
				this.comboCounter += this.currentCombo;
				this.currentCombo = 0;
			}

			this.addShiftedBall(this.balls[index]);
		} else {
			if (this.currentCombo > this.maxCombo) {
				this.maxCombo = this.currentCombo;
			}
			this.comboCounter += this.currentCombo;
			this.currentCombo = 0;
		}
	}

	// Метод для проверки окончания игры.
	checkWinGame(tempBalls) {
		// Если длина массива balls равна длине массива tempBalls, игра считается завершенной.
		if (this.balls.length === tempBalls.length) {
			this.gameEnd = true;// Устанавливаем флаг gameEnd в значение true, указывая на окончание игры.
			this.music.main.pause();// Приостанавливаем воспроизведение основной музыки.
			this.frog.canShoot = 0;// Запрещаем лягушке стрелять.

			setTimeout(() => {
				// Через 5 секунд после окончания игры вызываем метод checkScore игрока.
				this.player.checkScore(this.player.score);
			}, 5000);
		}
	}

	// Метод для добавления сдвинутого шара.
	addShiftedBall(ball) {
		if (this.shiftedBalls === null) {
			this.shiftedBalls = [];
			this.shiftedBalls.push(ball);
		} else {
			this.shiftedBalls.push(ball);
		}

		setTimeout(() => {
			this.ballNeedShift = true;
			this.music.shifted.currentTime = 0;
			this.music.shifted.play();
		}, 100);
	}

	// Метод для добавления сдвинутого шара.
	shiftOfTwoTails() {
		if (this.shiftedBalls.length !== 0) {

			for (let i = 0; i < this.shiftedBalls.length; i++) {
				let index = this.balls.indexOf(this.shiftedBalls[i]);

				if (index !== -1 && this.balls[index - 1]) {

					if (this.shiftedBalls[i].color === this.balls[index - 1].color) {
						let speed;

						if (this.shiftedBalls[i].getTrackSection() - this.balls[index - 1].getTrackSection() > this.spacing + 2) {
							speed = 1;
						} else {
							speed = 10;
						}

						this.pushNextBall(index, -speed);

						if (this.shiftedBalls[i].getTrackSection() - this.balls[index - 1].getTrackSection() <= this.spacing) {
							// this.multiplierCombo++;
							this.shiftedBalls.splice(i, 1);

							this.checkTail(index - 1, true);

							if (this.shiftedBalls.length === 0) {
								this.ballNeedShift = false;
							}
						}
					} else {
						this.shiftedBalls.splice(i, 1);
						if (this.currentCombo > this.maxCombo) {
							this.maxCombo = this.currentCombo;
						}
						this.comboCounter += this.currentCombo;
						this.currentCombo = 0;
					}
				}
			}
		} else {
			this.ballNeedShift = false;
		}
	}

	// Метод для выполнения выстрела.
	shooting() {
		if (this.frog.shotState === 1) {

			let flag = this.checkCollision({ x: this.frog.shotLeft, y: this.frog.shotTop });

			if (flag !== -1) {
				let previousX = this.track[this.balls[flag].getTrackSection() - Math.ceil(this.balls[flag].ballRadius)].x;
				let previousY = this.track[this.balls[flag].getTrackSection() - Math.ceil(this.balls[flag].ballRadius)].y;
				let previousDistance = Math.sqrt(
					(this.frog.shotLeft - previousX) * (this.frog.shotLeft - previousX) +
					(this.frog.shotTop - previousY) * (this.frog.shotTop - previousY)
				);

				let nextX = this.track[this.balls[flag].getTrackSection() + Math.ceil(this.balls[flag].ballRadius)].x;
				let nextY = this.track[this.balls[flag].getTrackSection() + Math.ceil(this.balls[flag].ballRadius)].y;
				let nextDistance = Math.sqrt(
					(this.frog.shotLeft - nextX) * (this.frog.shotLeft - nextX) +
					(this.frog.shotTop - nextY) * (this.frog.shotTop - nextY)
				);

				let position = (previousDistance = nextDistance) ? 'next' : 'previous';
				let ball = this.createRandomBall();
				ball.color = this.frog.color;
				this.checkPosition(ball, flag, position);
			}
		}
	}

	// Метод для отрисовки игровых элементов.
	draw() {
		this.player.updateGameScore();

		if (this.ballNeedShift) {
			this.shiftOfTwoTails();
		}

		this.shooting();

		if (!this.gameEnd) {

			if (!this.gameEnd) {

				this.frog.canShoot = 1;
				this.createBalls();
			}

			for (let i = 0; i < this.balls.length; i++) {
				this.views[i].draw();
			}
		}
	}

	// Метод для обработки события выгрузки страницы.
	checkUnload() {
		window.addEventListener('popstate', () => {
			if (location.hash !== '#game' && !this.gameEnd) {
				let conf = confirm('Ваш прогресс не будет сохранен. Вы уверены что хотите покинуть игру?');
				if (conf) {
					this.gameEnd = true;
					this.music.main.pause();
					location.hash = '#main';
				}
				else {
					location.hash = '#game';
				}
			}
		});
	}

	// Метод для создания объекта с музыкальными элементами.
	createMusic() {
		let musicArray = {};
		let main = new Audio();
		main.src = Main_MP3;
		main.play();
		main.loop = true;

		let shifted = new Audio();
		shifted.src = FireBall_MP3;

		musicArray.main = main;
		musicArray.shifted = shifted;

		return musicArray;
	}
}
export { BallController }