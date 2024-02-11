export const LogoComponent = {
	render: () => {
		return `<div id="login" class="login">
		<form id="login-form" class="login-form">
			<div class="item">
				<label for="email">Email</label>
				<input id="email" class="input-login" name="email" type="email" autocomplete="on">
			</div>
			<div class="item">
				<label for="password">Password</label>
				<input id="password" class="input-login" name="password" type="password" autocomplete="off">
			</div>
			<div id="loginMessage" class="login-form-error">
				<div id="errorLoginMessage" class="errorlabel"></div>
			</div>
			<div class="login-form-btn">
				<button id="btnLogin" type="button">Log in</button>
				<button id="btnRegister" type="button" name="register">Sign up</bsutton>
			</div>
		</form>
	</div>`;
	}
};