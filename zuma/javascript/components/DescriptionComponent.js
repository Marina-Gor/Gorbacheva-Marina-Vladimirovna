export const DescriptionComponent = {
	id: "description",
	title: "Description",
	render: (className = "container") => {
		return `
		<section class="${className}">
		<h2 class="description-title">Description:</h2>
		<div class="description-content">
			<p class="description-text">Zuma's goal is to eliminate all the balls rolling along the screen along a
				given path before they
				reach the yellow skull-shaped area.</p>
		</div>
	</section>
	`;
	}
};