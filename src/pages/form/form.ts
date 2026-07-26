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
		handleFiles(fileElement.files);
	});
	// Form Image Container
	const formFileContainer = document.getElementById("form-file-container");
	if (!formFileContainer) throw new Error("Fatal Error: Failed to locate #form-file-container");
	formFileContainer.addEventListener("click", () => formFileInput.click());
	formFileContainer.addEventListener("dragover", (event) => {
		event.preventDefault();
		formFileContainer.classList.add("drag-active");
	});
	formFileContainer.addEventListener("dragleave", () => formFileContainer.classList.remove("drag-active"));
	formFileContainer.addEventListener("drop", (event) => {
		event.preventDefault();
		formFileContainer.classList.remove("drag-active");
		handleFiles(event.dataTransfer?.files);
	});
}

// Register this page to the page renderer
registerPage("form", renderFormPage);

/**
 * Deals with files collected from drag-drop or explorer selection, ensuring they are images.
 *
 * @param files List of files received as input to upload container.
 */
function handleFiles(files: FileList | undefined | null) {
	if (!files) throw new Error("Fatal Error: Files object was invalid, associated elements must be missing");

	/* ------------------------ Confirm we received files ----------------------- */
	if (files.length < 1) {
		console.warn("Dragged in non-file, likely from a webpage. This is not supported.");
		// FEAT: Look into supporting this for web images/links?
		// FEAT: Add support for pasting image from clipboard
		return;
	}

	/* ---------------- We have images, disable upload indicators --------------- */
	const uploadIndicators = document.getElementById("upload-indicators");
	if (!uploadIndicators) throw new Error("Fatal Error: Failed to locate #upload-indicators");
	uploadIndicators.hidden = true;
	const uploadsContainer = document.getElementById("upload-image-container");
	if (!uploadsContainer) throw new Error("Fatal Error: Failed to locate #upload-image-container");
	uploadsContainer.hidden = false;

	/* --------------------- Loop through images and display -------------------- */
	for (const file of files) {
		if (!file.type.startsWith("image/")) continue; // Skip non-images
		console.dir(file);

		// Make a wrapper to contain image elements
		const imageWrapper = document.createElement("div") as HTMLDivElement;
		imageWrapper.className = "image-wrapper";
		uploadsContainer.append(imageWrapper);

		// Make the image file into an HTML Image element to insert
		const newImage = document.createElement("img") as HTMLImageElement;
		newImage.className = "uploaded-image";
		newImage.src = URL.createObjectURL(file);
		imageWrapper.append(newImage);

		// Make the delete button
		const deleteButton = document.createElement("button") as HTMLButtonElement;
		deleteButton.className = "delete-button";
		deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;
		imageWrapper.append(deleteButton);
	}
}

// TODO: Where applicable, convert div elements to button elements so they gain tabbing and enter/space interaction for free
