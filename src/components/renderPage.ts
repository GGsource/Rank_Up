import homeHTMLRaw from "../pages/home/home.html?raw";
import rankupHTMLRaw from "../pages/rankup/rankup.html?raw";
import { initializeRankUp } from "../pages/rankup/rankup";

export function renderPage(pageName: string = "home") {
	// Get the container
	let contentDiv = document.getElementById("pageContainer");
	if (!contentDiv) {
		console.error("Failed to fetch pageContainer.");
		return;
	}
	// Clear out any potential previous content
	contentDiv.innerHTML = "";
	// Create a new div for the contents
	let pageContents = document.createElement("div");
	pageContents.classList.add("pageContents");
	// track script to run after if applicable
	let postRenderScript: (() => void) | null = null;

	// Retrieve contents
	switch (pageName.toLowerCase()) {
		case "home":
			pageContents.innerHTML = homeHTMLRaw;
			break;
		case "rankup":
			pageContents.innerHTML = rankupHTMLRaw;
			postRenderScript = initializeRankUp;
			break;
		default:
			pageContents.innerHTML = "I didn't find shit!!! Fuh 😩";
			console.error(`Failed to find "${pageName.toLocaleLowerCase}" page`);
			break;
	}
	// Inject contents into page
	contentDiv.appendChild(pageContents);
	// Run post script
	if (postRenderScript) postRenderScript();
}
