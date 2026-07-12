export async function renderPage(pageName: string) {
	// Get the container
	let pageContainer = document.getElementById("page-container");
	if (!pageContainer) throw new Error("Fatal Error: Failed to fetch #page-container, cannot render page.");
	// TODO: Make it so each render function below swaps the class for pageContainer in order to scope properly

	// Render contents
	switch (pageName.toLowerCase()) {
		case "home":
			const { renderHomePage } = await import("@/pages/home/home");
			renderHomePage(pageContainer);
			pageContainer.className = "homePage";
			break;
		case "rankup":
			const { renderRankUpPage } = await import("@/pages/rankup/rankup");
			renderRankUpPage(pageContainer);
			pageContainer.className = "rankupPage";
			break;
		default:
			pageContainer.innerHTML = "I didn't find shit!!! Fuh 😩";
			pageContainer.className = "";
			console.error(`Failed to find "${pageName.toLocaleLowerCase}" page`);
			break;
	}
}
