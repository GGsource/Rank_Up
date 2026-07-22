import homeHTMLRaw from "./home.html?raw";
import "./home.css";
import plusIconImage from "@/assets/images/icon_plus.png";
import { registerPage, renderPage } from "@/components/renderPage";

function renderHomePage(pageContainer: HTMLElement) {
	/* -------------------------- Inject Home Page HTML ------------------------- */
	pageContainer.innerHTML = homeHTMLRaw;

	/* ------------------------------ Insert icons ------------------------------ */
	const plusIconElement = document.getElementById("icon-plus") as HTMLImageElement | null;
	if (!plusIconElement) console.error("Error: Failed to locate #icon-plus element to attach image source.");
	else plusIconElement.src = plusIconImage;

	/* ----------------------- Attach new rankup listener ----------------------- */
	const newRankUpBtn = document.getElementById("create-new-rankup-card");
	if (!newRankUpBtn) throw new Error("Fatal Error: Failed to locate #create-new-rankup-card element to attach listener.");
	newRankUpBtn.addEventListener("click", (event) => renderPage("form"));
}

// Register this page to the renderer
registerPage("home", renderHomePage);
