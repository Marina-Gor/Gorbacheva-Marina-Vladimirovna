export const HomeComponent = {
	id: "main",
	title: "Main",
	render: (className = "container") => {
		return `
		<section class="${className}">
			<h2 class="main-title">Welcome to the wonderful world of Zuma!</h2>
		</section>
	`;
	}
};