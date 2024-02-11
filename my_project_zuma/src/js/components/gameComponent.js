export const GameComponent = {
	id: "game",
	title: "Game",
	render: (className = "container") => {
		return `
		<section class="${className} game">
			<div class="game-field">
				<div class="game-score">SCORE: 0</div>
			</div>
			<canvas id="canvas" class="${className}"></canvas>
		</section>
	`;
	}
};