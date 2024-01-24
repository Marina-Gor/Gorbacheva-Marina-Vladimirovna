export const RulesComponent = {
	id: "rules",
	title: "Rules",
	render: (className = "container") => {
		return `
		<section class="${className}">
		<h2 class="rules-title">Rules game:</h2>
		<div class="rules-container">
			<p class="rules-text">The game "Zuma" is controlled with the mouse. The aim is the cursor. Shoot
				the balls with the left click, trying to get into groups of two or more balls of the same color.
			</p>
		</div>
	</section>
	`;
	}
};