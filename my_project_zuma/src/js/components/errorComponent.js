import { error } from '../pictures';
export const ErrorComponent = {
	id: "error",
	title: "Error",
	render: (className = "container") => {
		return `
		<section class="${className} error">
		<img class="error-img" src="${error}" alt="error 404">
		<p class="error-text"><span>404</span> Sorry this page not found, please try to return to the <a
				href="#main">main page</a>.</p>
	</section>
	`;
	}
};