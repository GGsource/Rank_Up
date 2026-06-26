import { renderPage } from "../../components/renderPage";
import plusIconImage from "../../assets/images/icon_plus.png";

addEventListener("DOMContentLoaded", () => {
	// Render the page
	renderPage();

	// Insert icons
	let plusIconElement = document.getElementById("icon-plus") as HTMLImageElement | null;
	if (plusIconElement) plusIconElement.src = plusIconImage;
	else console.error("Error: Failed to locate icon-plus element to attach image source.");

	// Attach new rankup listener
	const newRankUpBtn = document.getElementById("create-new-rankup-card");
	if (newRankUpBtn) newRankUpBtn.addEventListener("click", (event) => renderPage("RankUp"));
	// TODO: Redirect this to the form page instead of rankup
	else console.error("Error: Failed to locate create-new-rankup-card element to attach listener.");
});
