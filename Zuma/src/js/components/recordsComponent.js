export const RecordsComponent = {
	id: "records",
	title: "Records",
	render: (className = "container") => {
		return `
		<section class="${className} records">
			<h2 class="records-title">Records</h2>
			<form id="addNewUser" class="records-form">
				<div class="field">
					<div class="text">Add a username</div>
					<input type="text" class="input" id="newUserName" name="username" placeholder="Enter a name" required>
					<button class="addBtn" id="addBtn">&#x2B</button>
				</div>
			</form>
		</section>
	`;
	}
};