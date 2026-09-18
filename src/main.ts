import { renderPath } from "@/components/renderPage";
import { getEl } from "@/utils/utils";
import { MODE } from "@/utils/const";
import "@/styles/global.css";

document.addEventListener("DOMContentLoaded", () => {
	/* ----------------------------- Set Mode Banner ---------------------------- */
	const modeBanner = getEl("mode-banner");
	if (!MODE) modeBanner.remove();
	else modeBanner.innerText = `${MODE} Mode`;

	/* --------------------------- Render the requested page -------------------------- */
	renderPath();
});

window.addEventListener("popstate", () => renderPath(false));
