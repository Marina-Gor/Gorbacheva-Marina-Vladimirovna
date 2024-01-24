const ModalPlugin = (function () {
	function ModalView() {
		let myModalContainer = null;
		let modal = null;

		this.init = function (container) {
			myModalContainer = container;
			modal = document.querySelector('.modal');
		}

		this.show = function (modalId) {
			const modalElement = document.getElementById(modalId);
			modalElement.classList.remove('modal-closed');
		}

		this.hide = function (modalId) {
			const modalElement = document.getElementById(modalId);
			modalElement.classList.add('modal-closed');
		}

		this.createModalElement = function (modalId, modalTitle, modalContent) {
			const modalElement = document.createElement('div');
			modalElement.id = modalId;
			modalElement.classList.add('modal-container');

			const closeButton = document.createElement('div');
			closeButton.classList.add('close-modal');
			closeButton.innerText = '❌';

			modalElement.appendChild(closeButton);

			const titleElement = document.createElement('h1');
			titleElement.innerText = modalTitle;
			modalElement.appendChild(titleElement);

			const contentElement = document.createElement('p');
			contentElement.innerText = modalContent;
			modalElement.appendChild(contentElement);
			modal.appendChild(modalElement);
		}

		this.updateModalContent = function (modalId, modalTitle, modalContent) {
			const modalElement = document.getElementById(modalId);
			const titleElement = modalElement.querySelector('h1');
			const contentElement = modalElement.querySelector('p');
			titleElement.innerText = modalTitle;
			contentElement.innerText = modalContent;

		}
	}

	function ModalModel() {
		let myModalView = null;

		this.init = function (view) {
			myModalView = view;
		}

		this.checkingEvents = function (event) {
			if (event.target.classList.contains('close-modal')) {
				const modalId = event.target.parentElement.id;
				myModalView.hide(modalId);
			}
		}

		this.checkingAttribute = function (modalId, modalTitle, modalContent) {
			const existingModal = document.getElementById(modalId);
			if (existingModal) {
				if (modalTitle && modalContent) {
					myModalView.updateModalContent(modalId, modalTitle, modalContent);
				}
				myModalView.show(modalId);
			} else {
				if (modalTitle && modalContent) {
					myModalView.createModalElement(modalId, modalTitle, modalContent);
				}
			}
		}
	}

	function ModalController() {
		let myModalModel = null;
		let myModalContainer = null;
		let modal = null;
		let elements = null;

		this.init = function (model, container) {
			myModalModel = model;
			myModalContainer = container;
			modal = document.querySelector('.modal');
			elements = container.querySelectorAll('[data-supermodal]');

			elements.forEach((link) => {
				link.addEventListener('click', this.getLinkData);
			});

			modal.addEventListener('click', this.checkingEvents);
		}

		this.getLinkData = function (event) {
			event.preventDefault();
			const link = event.target;
			const modalId = link.getAttribute('data-supermodal');
			const modalTitle = link.getAttribute('data-supermodal-title');
			const modalContent = link.getAttribute('data-supermodal-content');
			myModalModel.checkingAttribute(modalId, modalTitle, modalContent);
		}

		this.checkingEvents = function (event) {
			myModalModel.checkingEvents(event);
		}
	}

	return {
		init(container) {
			const modalView = new ModalView();
			const modalModel = new ModalModel();
			const modalController = new ModalController();

			modalView.init(container);
			modalModel.init(modalView);
			modalController.init(modalModel, container);
		},
	};
})();

window.addEventListener('DOMContentLoaded', () => {
	const container = document.querySelector('.container');
	ModalPlugin.init(container);
});

return {
	init: function () {
		const appModalView = new ModalView();
		const appModalModel = new ModalModel();
		const appModalController = new ModalController();

		appModalView.init(document.querySelector('.container'));
		appModalModel.init(appModalView);
		appModalController.init(appModalModel, document.querySelector('.container'));
	}
}
}())
document.addEventListener("DOMContentLoaded", module.init());