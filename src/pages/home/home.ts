import { renderPage } from "../../components/renderPage";

addEventListener("DOMContentLoaded", () => {
	// Render the page
	renderPage();

	const newRankUpBtn = document.getElementById("create-new-rankup-card");
	if (newRankUpBtn) {
		newRankUpBtn.addEventListener("click", (event) => {
			renderPage("RankUp");
		});
	}
});
