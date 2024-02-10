import { HomeComponent } from './components/homeComponent';
import { MainComponent } from './components/mainComponent';
import { GameComponent } from './components/gameComponent';
import { RulesComponent } from './components/rulesComponent';
import { RecordsComponent } from './components/recordsComponent';
import { ErrorComponent } from './components/errorComponent';
import { CanvasController } from './game/controller/canvasController';

export const mySPA = (function () {

	/* ------- begin view -------- */
	function ModuleView() {
		let myModuleContainer = null;
		let menu = null;
		let contentContainer = null;
		let isAnimating = false;

		const router = {
			main: MainComponent,
			game: GameComponent,
			rules: RulesComponent,
			records: RecordsComponent,
			error: ErrorComponent,
		};

		this.init = function (container) {
			myModuleContainer = container;
			menu = myModuleContainer.querySelector("#menu");
			contentContainer = myModuleContainer.querySelector("#content");
			this.renderContent("main");
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
			if (hashPageName === "game") {
				setTimeout(() => {
					this.play();
				}, 10);
			}
		}

		this.play = function () {
			let canvasController = new CanvasController();
			isAnimating = true;

			function work() {
				if (isAnimating) {
					canvasController.draw();
					requestAnimationFrame(work);
				}
			}
			requestAnimationFrame(work);
		};

		// this.play = function () {
		// 	let now;
		// 	let delta;
		// 	let then = Date.now();
		// 	let interval = 1000 / 62;
		// 	let canvasController = new CanvasController();

		// 	function work() {
		// 		requestAnimationFrame(work);
		// 		now = Date.now();
		// 		delta = now - then;

		// 		if (delta > interval) {
		// 			then = now - (delta % interval);
		// 			canvasController.draw();
		// 		}
		// 	}
		// 	requestAnimationFrame(work);
		// }
	};

	/* ------- begin model ------- */
	function ModuleModel() {
		let myModuleView = null;

		this.init = function (view) {
			myModuleView = view;
		}

		this.updateState = function (hashPageName) {
			myModuleView.renderContent(hashPageName);
		}

		this.startGame = function () {
			myModuleView.play();
		}
	}

	/* ----- begin controller ---- */
	function ModuleController() {
		let myModuleContainer = null;
		let myModuleModel = null;

		this.init = function (container, model) {
			myModuleContainer = container;
			myModuleModel = model;

			// вешаем слушателя на событие hashchange
			window.addEventListener("hashchange", this.updateState);
			// this.updateState(); //первая отрисовка
			this.addEventListeners();
		};

		this.updateState = function () {
			const hashPageName = location.hash.slice(1).toLowerCase();
			myModuleModel.updateState(hashPageName);
		};

		this.addEventListeners = function () {
			document.addEventListener('click', function (e) {
				if (e.target && e.target.id === 'game') { // game play
					myModuleModel.startGame();
				}
			});

		};
	}

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

		main: function () {
			console.log('Initializing the game');
		},

		initBuildHtml: function (elem) {
			const app = document.getElementById(elem);
			app.className = 'app';
			app.innerHTML = HomeComponent.render();
		},
	};

}());
/*** --- init module --- ***/
document.addEventListener("DOMContentLoaded", mySPA.init("app")); // инициализируем модуль как только DOM готов.