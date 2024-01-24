export const ErrorComponent = {
	id: "error",
	title: "Error",
	render: (className = "container") => {
		return `
		<section class="${className}">
		<p class="error-text"><span>404</span> Sorry this page not found, please try to return to the <a
				href="#main">main page</a>.</p>
		<img class="error-img" src="./images/404.png" alt="error 404">
	</section>
	`;
	}
};