import { logo } from '../pictures';
export const HomeComponent = {
	render: () => {
		return `
		<header class="header">
			<img class="header-logo" src="${logo}" alt="Logo">
			<a href="#" id="logoutBtn" class="exit"></a>
		</header>
		<main class="main">
			<nav class="main-menu" id="menu">
				<ul class="menu-list">
					<li><a class="menu-link" href="#rules">How to play</a></li>
					<li><a class="menu-link" href="#records">Records</a></li>
					<li><a class="menu-link" href="#game">Adventure</a></li>
				</ul>
			</nav>
		<div class="content" id="content"></div>
		</main>
	 `;
	}
};