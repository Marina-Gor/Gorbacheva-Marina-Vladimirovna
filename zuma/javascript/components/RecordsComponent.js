export const RecordsComponent = {
	id: "records",
	title: "Records",
	render: (className = "container") => {
		return `
		<section class="${className}">
			<h1 class="records-title">Records</h1>
			<p class="records-text"></p>
		</section>
	`;
	}
};