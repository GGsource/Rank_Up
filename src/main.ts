import { renderPage } from "./components/renderPage";
import "@/styles/global.css";

document.addEventListener("DOMContentLoaded", () => {
	/* ----------------------------- Set Mode Banner ---------------------------- */
	const modeBanner = document.getElementById("mode-banner");
	if (!modeBanner) throw new Error("Couldn't find the mode banner to set :/");
	if (window.location.hostname.startsWith("rankup.ggsource")) modeBanner.remove();
	else modeBanner.innerText = import.meta.env.DEV ? "Dev Mode" : "Build Preview";

	/* --------------------------- Render the homepage -------------------------- */
	renderPage("home");
});
