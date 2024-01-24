// import { HomeComponent } from './components/HomeComponent';
// import { GameComponent } from './components/GameComponent';
// import { RulesComponent } from './components/RulesComponent';
// import { RecordsComponent } from './components/RecordsComponent';
// import { DescriptionComponent } from './components/DescriptionComponentt';
// import { ErrorComponent } from './components/ErrorComponent';

/* ----- spa init module --- */
const mySPA = (function () {

	/* ------- begin view -------- */
	function ModuleView() {
		let myModuleContainer = null;
		let menu = null;
		let contentContainer = null;

		const HomeComponent = {
			id: "main",
			title: "Main",
			render: (className = "container") => {
				return `
				<section class="${className}">
				<h2 class="main-title">Welcome to the wonderful world of Zuma!</h2>
				<div class="player_name">
					<form class="game_player" name="formPlayer">
						 <input type="text" name="player" maxlength="30" placeholder="Your name...">
						 <span class="error_span"></span>
					</form>
			  </div>
				</section>
			`;
			}
		};

		const GameComponent = {
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

		const RulesComponent = {
			id: "rules",
			title: "Rules",
			render: (className = "container") => {
				return `
				<section class="${className}">
				<h2 class="rules-title">Rules game:</h2>
				<div class="rules-container">
				<ul class="rules_list">
				<li class="rules_item">The goal of the game is to shoot down as many balls as possible</li>
				<li class="rules_item">You can change the ball right mouse button</li>
				<li class="rules_item">When 3 or more balls are knocked down, the number of points received increases</li>
				<li class="rules_item">If the balls reach the end, you lose</li>
		  </ul>
				</div>
			</section>
			`;
			}
		};

		const RecordsComponent = {
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

		const ErrorComponent = {
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

		const router = {
			main: HomeComponent,
			game: GameComponent,
			rules: RulesComponent,
			records: RecordsComponent,
			error: ErrorComponent,
		};

		this.init = function (container) {
			myModuleContainer = container;
			menu = myModuleContainer.querySelector("#menu");
			contentContainer = myModuleContainer.querySelector("#content");
		}

		this.updateButtons = function (currentPage) {
			const menuLinks = menu.querySelectorAll(".mainmenu__link");
			const state = `#${currentPage}`;

			for (let link of menuLinks) {
				state === link.getAttribute("href") ? link.classList.add("active") : link.classList.remove("active");
			}
		}

		this.renderContent = function (hashPageName) {
			let routeName = "default";

			if (hashPageName.length > 0) {
				routeName = hashPageName in router ? hashPageName : "error";
			}

			window.document.title = router[routeName].title;
			contentContainer.innerHTML = router[routeName].render(`${routeName}-page`);
			this.updateButtons(router[routeName].id);
		}
	};
	/* -------- end view --------- */
	/* ------- begin model ------- */
	function ModuleModel() {
		let myModuleView = null;
		let track = null;
		let isInitMusicPlay = false;

		this.init = function (view) {
			myModuleView = view;
		}

		this.updateState = function (hashPageName) {
			myModuleView.renderContent(hashPageName);
		}

		this.playSound = function () {
			if (!isInitMusicPlay) {
				track.pause();
				track.play();
			}
			isInitMusicPlay = true;
		}
	}
	/* -------- end model -------- */

	/* ----- begin controller ---- */
	function ModuleController() {
		let myModuleContainer = null;
		let myModuleModel = null;

		this.init = function (container, model) {
			myModuleContainer = container;
			myModuleModel = model;

			// вешаем слушателя на событие hashchange
			window.addEventListener("hashchange", this.updateState);

			this.updateState(); //первая отрисовка
			this.addEventListeners();
		}

		this.updateState = function () {
			const hashPageName = location.hash.slice(1).toLowerCase();
			myModuleModel.updateState(hashPageName);
		}

		this.addEventListeners = function () {
			myModuleContainer.addEventListener('click', function (e) {
				if (e.target && e.target.id === 'sound') {
					myModel.playSound();
				}
			});
		}
	};
	/* ------ end controller ----- */

	return {
		init: function (container) {
			// @TODO: add validation of `container`
			this.initBuildHtml(container);
			this.main();

			const view = new ModuleView();
			const model = new ModuleModel();
			const controller = new ModuleController();

			//связываем части модуля
			view.init(document.getElementById(container));
			model.init(view);
			controller.init(document.getElementById(container), model);
		},

		main: function (container) {
			//предварительно что то можно сделать
			console.log(`Иницилизируем SPA для контейнера "${container}"`);
		},

		initBuildHtml: function (elem) {
			const app = document.getElementById(elem);
			app.className = 'app';
			app.innerHTML = `
			<header class="header">
			<img class="header-logo" src="./images/Zuma_logo.png" alt="Logo">
		</header>
		<main class="main">
			<div class="content" id="content"></div>
			<nav class="main-menu" id="menu">
				<ul class="menu-list">
					<li><a class="menu-link" href="#main">Adventure</a></li>
					<li><a class="menu-link" href="#game">Adventure</a></li>
					<li><a class="menu-link" href="#rules">How to play</a></li>
					<li><a class="menu-link" href="#records">Records</a></li>
				</ul>
				<button class="sound" id="sound" data-playing="false"><img
				src="images/on_sound.png" alt="Sound"></button>
			</nav>
		</main>
		 `;
		},
	};

}());
/* ------ end app module ----- */

/*** --- init module --- ***/
document.addEventListener("DOMContentLoaded", mySPA.init("app")); // инициализируем модуль как только DOM готов.