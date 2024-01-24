export const GameComponent = {
	id: "game",
	title: "Game",
	render: (className = "container") => {
		return `
		<section class="${className}">
			<canvas id="canvas" class="${className} width=" 1024" height="576"></canvas>
		</section>
	`;
	}
};