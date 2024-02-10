import { Main_MP3 } from '../../sound.js';
import { FireBall_MP3 } from '../../sound.js';
import { BallModel } from "../model/ballModel.js";
import { BallView } from "../view/ballView.js";
import { Player } from "../player.js";

class BallController {
	constructor(totalBalls, frog) {
		this.frog = frog;
		this.totalBalls = totalBalls;
		this.player = new Player();
		this.balls = [];
		this.spacing = 36;
		this.track = [];
		this.views = [];
		this.createFirstBall();
		this.gameEnd = false;
		this.ballNeedShift = false;
		this.shiftedBalls = [];
		this.ballCounter = 0;

		this.currentCombo = 0;
		this.maxCombo = 0;
		// this.multiplierCombo = 1;
		this.comboCounter = 0;

		this.checkUnload();
		this.music = this.createMusic();
	}

	createFirstBall() {
		let ball = this.createRandomBall();
		let view = new BallView(ball);
		this.views.unshift(view);
		this.balls.unshift(ball);

		ball.createPosition(this.spacing);
		this.track = ball.track;
	}

	createBalls() {
		if (this.balls.length !== 0) {
			this.pushNextBall(0, 1);

			if (this.balls[0].getTrackSection() === this.spacing * 2 &&
				this.totalBalls !== 0 && this.totalBalls > 0
			) {
				let ball = this.createRandomBall();
				let view = new BallView(ball);
				this.views.unshift(view);
				this.balls.unshift(ball);
				ball.createPosition(this.spacing);
			}
		}
	}

	createRandomBall() {
		this.totalBalls--;
		this.ballCounter++;
		return new BallModel();
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

		ball.createPosition(pushPosition);

		this.balls.splice(index, 0, ball);

		this.frog.colors = this.checkColor();
		let view = new BallView(ball);
		this.views.splice(index, 0, view);

		if (this.balls[index - 1] &&
			this.balls[index - 1].color === this.balls[index].color &&
			this.balls[index].getTrackSection() - this.balls[index - 1].getTrackSection() > this.spacing + 1) {
			this.addShiftedBall(ball);
		}

		if (this.balls[index + 1] &&
			this.balls[index + 1].color === this.balls[index].color &&
			this.balls[index + 1].getTrackSection() - this.balls[index].getTrackSection() > this.spacing + 1) {
			this.addShiftedBall(this.balls[index + 1]);
		}

		this.checkTail(index, true);
	}

	pushNextBall(index, speed) {
		let tempBalls = [];
		tempBalls.push(this.balls[index]);

		for (let i = index; i < this.balls.length - 1; i++) {

			if (this.balls[i + 1].getTrackSection() - this.balls[i].getTrackSection() <= this.spacing) {

				if (this.balls[i + 1].getTrackSection() - this.balls[i].getTrackSection() < this.spacing) {

					this.balls[i + 1].update(4);
				}

				tempBalls.push(this.balls[i + 1]);
			} else {
				break;
			}
		}

		for (let i = this.balls.length - 1; i > 0; i--) {

			if (this.balls[i].getTrackSection() - this.balls[i - 1].getTrackSection() < this.spacing) {
				this.balls[i].update(1);
			}

		}

		for (let j = 0; j < tempBalls.length; j++) {
			tempBalls[j].update(speed);
		}

		if (this.balls[this.balls.length - 1].getTrackSection() >= this.track.length - this.spacing) {
			this.balls.splice(this.balls.length - 2, 1);

			if (this.balls.length === 2) {
				this.gameEnd = true;
				this.frog.canShoot = 0;
				this.music.main.pause();
				// this.music.end.play();

			}

			if (this.gameEnd) {
				setTimeout(() => {
					// this.player.nextLevel('lose');
				}, 500);
			}
		}
	}

	checkCollision(shot) {
		for (let i = 0; i < this.balls.length; i++) {

			let dx = this.balls[i].x - shot.x;
			let dy = this.balls[i].y - shot.y;
			let distance = Math.sqrt((dx * dx) + (dy * dy));

			if (distance <= this.balls[i].ballRadius * 2) {
				this.frog.down = 1;
				return i;
			}
		}
		return -1;
	}

	checkPosition(ball, index, position) {
		let pushPosition;

		if (position === 'next') {
			pushPosition = this.balls[index].getTrackSection();
		} else if (position === 'previous') {
			pushPosition = this.balls[index].getTrackSection() - this.spacing;
		}
		this.pushBall(ball, pushPosition);
	}

	checkColor() {
		let colorArray = [];

		for (let i = 0; i < this.balls.length; i++) {
			colorArray.push(this.balls[i].color);
		}

		return Array.from(new Set(colorArray));
	}

	checkTail(index, status) {
		let tempBalls = [];
		tempBalls.push(this.balls[index]);

		let color = this.balls[index].color;
		let i = index + 1;

		while (this.balls[i]) {

			if (this.balls[i].color === color) {

				if (this.balls[i].getTrackSection() - this.balls[i - 1].getTrackSection() <= this.spacing + 1) {
					tempBalls.push(this.balls[i]);
					i++;
				} else if (!status) {
					tempBalls.push(this.balls[i]);
					i++;
				} else {
					break;
				}
			} else {
				break;
			}
		}

		let j = index - 1;

		while (this.balls[j]) {

			if (this.balls[j].color === color) {

				if (this.balls[j + 1].getTrackSection() - this.balls[j].getTrackSection() <= this.spacing + 1) {
					tempBalls.push(this.balls[j]);
					j--;
				} else if (!status) {
					tempBalls.push(this.balls[j]);
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
			this.clearBalls(j, tempBalls);
		}
		return tempBalls.length;
	}

	clearBalls(index, tempBalls) {
		this.currentCombo++;

		this.checkWinGame(tempBalls);

		let tempScore = 0;

		for (let i = 0; i < tempBalls.length; i++) {
			// tempScore += 10 + this.frog.level
			tempScore += 10;
		}

		// tempScore *= this.multiplierCombo * this.frog.level;
		// tempScore *= this.multiplierCombo;
		this.player.score += tempScore;

		this.balls.splice(index, tempBalls.length);
		this.views.splice(index, tempBalls.length);

		if (!this.gameEnd) {
			this.frog.colors = this.checkColor();
		}

		if (this.balls[index - 1] &&
			this.balls[index] &&
			this.balls[index - 1].color === this.balls[index].color
		) {
			if (this.checkTail(index, false) < 3) {
				if (this.currentCombo > this.maxCombo) {
					this.maxCombo = this.currentCombo;
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
			// this.music.clearBall.currentTime = 0;
			// this.music.clearBall.play();
		}
	}

	checkWinGame(tempBalls) {
		if (this.balls.length === tempBalls.length) {
			this.gameEnd = true;
			this.music.main.pause();

			this.frog.canShoot = 0;
			// this.player.getExtraScore(this.track, this.balls[this.balls.length - 1].getTrackSection(), this.frog.level);

			// let currentLevel = localStorage.getItem('level');
			// let nextLevel = this.frog.level + 1;

			// if (nextLevel < currentLevel) {
			// 	localStorage.setItem('level', currentLevel);
			// } else if (nextLevel > currentLevel && this.frog.level < 9) {
			// 	localStorage.setItem('level', String(nextLevel));
			// }

			setTimeout(() => {
				this.player.checkScore(this.player.score);
				// this.music.win.play();

				this.player.nextLevel(
					'win',
					this.frog.level,
					this.ballCounter,
					this.player.score
				);
			}, 5000);
		}
	}

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
								// this.multiplierCombo = 1;
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
			// this.multiplierCombo = 1;
		}
	}

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