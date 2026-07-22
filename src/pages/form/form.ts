import formHTMLRaw from "./form.html?raw";
import "./form.css";
import { registerPage, renderPage } from "@/components/renderPage";

function renderFormPage(pageContainer: HTMLElement) {
	/* -------------------------- Inject Form Page HTML ------------------------- */
	pageContainer.innerHTML = formHTMLRaw;

	/* -------------------- Add Submission Button Interaction ------------------- */
	const submitButton = document.getElementById("form-submit");
	if (!submitButton) throw new Error("Fatal Error: Failed to locate submission button to attach listeners. Aborting...");
	submitButton.addEventListener("click", () => renderPage("rankup"));
}

// Register this page to the page renderer
registerPage("form", renderFormPage);
