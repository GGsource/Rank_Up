import formHTMLRaw from "./form.html?raw";
import "./form.css";
import { registerPage, renderPage } from "@/components/renderPage";

async function renderFormPage(pageContainer: HTMLElement) {
	/* -------------------------- Inject Form Page HTML ------------------------- */
	pageContainer.innerHTML = formHTMLRaw;

	/* ---------------------------- Add Interactions ---------------------------- */
	// Submission button
	const submitButton = document.getElementById("form-submit");
	if (!submitButton) throw new Error("Fatal Error: Failed to locate submission button to attach listeners. Aborting...");
	submitButton.addEventListener("click", () => renderPage("rankup"));
	// Form Image Input
	const formFileInput = document.getElementById("form-file-input");
	if (!formFileInput) throw new Error("Fatal Error: Failed to locate #form-file-input");
	formFileInput.addEventListener("change", (event) => {
		const fileElement = event.target as HTMLInputElement;
		const files = fileElement.files;
		console.log("Files gathered from explorer:");
		console.dir(files);
	});
	// Form Image Container
	const formFileContainer = document.getElementById("form-file-container");
	if (!formFileContainer) throw new Error("Fatal Error: Failed to locate #form-file-container");
	formFileContainer.addEventListener("click", () => formFileInput.click());
	formFileContainer.addEventListener("dragover", (event) => {
		event.preventDefault();
		formFileContainer.classList.add("drag-active");
		console.log("Dragging over...");
	});
	formFileContainer.addEventListener("dragleave", () => formFileContainer.classList.remove("drag-active"));
	formFileContainer.addEventListener("drop", (event) => {
		event.preventDefault();
		formFileContainer.classList.remove("drag-active");
		console.log("Files gathered from drag-n-drop:");
		console.dir(event.dataTransfer?.files);
	});
}

// Register this page to the page renderer
registerPage("form", renderFormPage);
