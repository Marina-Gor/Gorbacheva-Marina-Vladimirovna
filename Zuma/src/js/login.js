import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { app, analytics, auth, database } from './firebase';
import { LogoComponent } from './components/logoComponent';
import { mySPA } from './spa';

export const logInApp = (function () {
	/* ------- begin view -------- */
	function View() {
		let appContainer = null;
		let errorMsgFeild = null;
		let logoutBtn = null;
		let loginContainer = null;
		let content = null;

		this.init = function (app) {
			appContainer = app;
			this.showLoginForm();
			logoutBtn = document.querySelector('#btnLogout');
			loginContainer = app.querySelector('#login');
			errorMsgFeild = app.querySelector('#errorLoginMessage');
		}

		this.showLoginForm = function () {
			content = LogoComponent.render();
			appContainer.innerHTML = content;
		}

		this.loginSuccess = function (msg) {
			errorMsgFeild.textContent = `${msg}, login successfull!`;
		}

		this.loginError = function (error) {
			errorMsgFeild.style.color = 'rgb(255, 0, 0)';
			errorMsgFeild.textContent = `Login unsuccessfull`;
			console.log(`Login unsuccessfull: ${error}`);
		}

		this.registerSuccess = function (msg) {
			errorMsgFeild.textContent = `${msg}, registration successfull! Please login.`;
		}

		this.registerError = function (error) {
			errorMsgFeild.style.color = 'rgb(255, 0, 0)';
			errorMsgFeild.textContent = `Registration unsuccessfull`;
			console.log(`Registration unsuccessfull: ${error}`);
		}

		this.showForm = function () {
			logoutBtn.style.display = 'none';
			loginContainer.style.display = 'block';
		}

		this.hideForm = function () {
			loginContainer.style.display = 'none';
		}

		this.logoutError = function (error) {
			console.log(`An error happened. ${error}`);
		}
	}

	/* ------- begin model ------- */
	function Model() {
		let myView = null;

		this.init = function (view) {
			myView = view;
		}

		this.login = function (email, pass) {
			// Авторизоваться
			signInWithEmailAndPassword(auth, email, pass)
				.then((userCredential) => {
					// Вошел в систему
					const user = userCredential.user.email.split('@').slice(0, 1)[0];
					myView.loginSuccess(user);
					setTimeout(() => {
						myView.hideForm();
						mySPA.init('app');
					}, 750);
				})
				.catch((error) => {
					myView.loginError(error.code);
				});
		}


		this.register = function (email, pass) {
			// Для новой регистрации
			createUserWithEmailAndPassword(auth, email, pass)
				.then((userCredential) => {
					// Вошел в систему
					const user = userCredential.user.email.split('@').slice(0, 1)[0];
					myView.registerSuccess(user);
				})
				.catch((error) => {
					myView.registerError(error.code);
				});
		}

		this.logout = function () {
			signOut(auth).then(() => {
				// Выход выполнен успешно.
				logInApp.init('app', false);
				myView.showForm();
			}).catch((error) => {
				// Произошла ошибка.
				myView.logoutError(error);
			});
		}

		this.addUser = function (username) {
			database
				.ref("users/" + `user_${username.replace(/\s/g, "").toLowerCase()}`)
				.set({
					username: `${username}`,
				})
				.then(function () {
					console.log("Пользователь добавлен в коллецию users");
				})
				.catch(function (error) {
					console.error("Ошибка добавления пользователя: ", error);
				});
		};
	}

	/* ----- begin controller ---- */
	function Controller() {
		let myModel = null;
		let appContainer = null;
		// let form = null;
		let formadd = null;

		this.init = function (app, model) {
			myModel = model;
			appContainer = app;
			this.addEventListeners();
		}

		this.addEventListeners = function () {
			appContainer.addEventListener('click', function (event) {
				// form = appContainer.querySelector('#login-form');
				formadd = appContainer.querySelector("#addNewUser");

				if (event.target && event.target.id === 'btnLogin') {
					event.preventDefault();
					event.stopPropagation();
					myModel.login(
						appContainer.querySelector('#email').value,
						appContainer.querySelector('#password').value
					);
				}

				if (event.target && event.target.id === 'btnRegister') {
					event.preventDefault();
					event.stopPropagation();
					myModel.register(
						appContainer.querySelector('#email').value,
						appContainer.querySelector('#password').value
					);
				}

				if (event.target && event.target.id === "logoutBtn") {
					event.preventDefault();
					event.stopPropagation();
					myModel.logout();
				}

				if (event.target && event.target.id === "addBtn") {
					event.preventDefault();
					event.stopPropagation();
					myModel.addUser(formadd.newUserName.value);
					formadd.newUserName.value = "";
				}
			});
		}
	}

	return {
		init: function (elem) {
			const myView = new View();
			const myModel = new Model();
			const myController = new Controller();

			myView.init(document.getElementById(elem));
			myModel.init(myView);
			myController.init(document.getElementById(elem), myModel,);
		},
	};
})();