class Player {
	constructor() {
		this.score = 0;
	}

	setRecords(data) {
		let table = document.querySelector('.records-table');
		let trs = table.querySelectorAll('.top-five');

		for (let i = 0; i < trs.length; i++) {
			trs[i].firstElementChild.textContent = data[i][0];
			trs[i].lastElementChild.textContent = data[i][1];
		}
	}

	updateGameScore() {
		let gameScore = document.querySelector('.game-score');
		gameScore.textContent = `SCORE : ${this.score}`;
	}
}

export { Player }