import formHTMLRaw from "./form.html?raw";
import "./form.css";
import { registerPage, renderPage } from "@/components/renderPage";

async function renderFormPage(pageContainer: HTMLElement) {
	/* -------------------------- Inject Form Page HTML ------------------------- */
	pageContainer.innerHTML = formHTMLRaw;

	/* ---------------------------- Add Interactions ---------------------------- */
	// Form Image Input
	const formFileInput = document.getElementById("form-file-input");
	if (!formFileInput) throw new Error("Fatal Error: Failed to locate #form-file-input");
	formFileInput.addEventListener("change", (event) => {
		const fileElement = event.target as HTMLInputElement;
		handleFiles(fileElement.files);
	});
	// Form Image Container
	const formUploadContainer = document.getElementById("form-upload-area");
	if (!formUploadContainer) throw new Error("Fatal Error: Failed to locate #form-file-container");
	formUploadContainer.addEventListener("click", () => formFileInput.click());
	formUploadContainer.addEventListener("dragover", (event) => {
		event.preventDefault();
		formUploadContainer.classList.add("drag-active");
	});
	formUploadContainer.addEventListener("dragleave", () => formUploadContainer.classList.remove("drag-active"));
	formUploadContainer.addEventListener("drop", (event) => {
		event.preventDefault();
		formUploadContainer.classList.remove("drag-active");
		handleFiles(event.dataTransfer?.files);
	});
	// Form Image Clear button
	const clearUploadsButton = document.getElementById("clear-uploads") as HTMLButtonElement;
	if (!clearUploadsButton) throw new Error("Fatal Error: Failed to locate #clear-uploads");
	clearUploadsButton.addEventListener("click", (event) => {
		console.log("clicked clear button...");
		const uploadsContainer = document.getElementById("upload-image-container");
		if (!uploadsContainer) throw new Error("Fatal Error: Failed to locate #upload-image-container");
		uploadsContainer.querySelectorAll("img.uploaded-image").forEach((image) => URL.revokeObjectURL((image as HTMLImageElement).src));
		uploadsContainer.hidden = true;
		const uploadIndicators = document.getElementById("upload-indicators");
		if (!uploadIndicators) throw new Error("Fatal Error: Failed to locate #upload-indicators");
		uploadIndicators.hidden = false;
		clearUploadsButton.disabled = true;
	});
	// Form Submission button
	const submitButton = document.getElementById("form-submit");
	if (!submitButton) throw new Error("Fatal Error: Failed to locate submission button to attach listeners. Aborting...");
	submitButton.addEventListener("click", () => renderPage("rankup"));
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
	const uploadsContainer = document.getElementById("upload-image-container");
	if (!uploadsContainer) throw new Error("Fatal Error: Failed to locate #upload-image-container");

	/* --------------------- Loop through images and display -------------------- */
	for (const file of files) {
		if (!file.type.startsWith("image/")) continue; // Skip non-images
		// TODO: Present warning to user if uploaded non-image?

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
		deleteButton.addEventListener("click", (event) => {
			event.stopPropagation();
			imageWrapper.remove();
			URL.revokeObjectURL(newImage.src);
			if (!uploadsContainer.hasChildNodes()) toggleHidden(uploadIndicators, uploadsContainer);
		});
		imageWrapper.append(deleteButton);
	}
	if (uploadsContainer.hasChildNodes()) {
		uploadIndicators.hidden = true;
		uploadsContainer.hidden = false;
		const clearUploadsButton = document.getElementById("clear-uploads") as HTMLButtonElement;
		if (!clearUploadsButton) throw new Error("Fatal Error: Failed to locate #clear-uploads");
		clearUploadsButton.disabled = true;
	}
}

// TODO: Where applicable, convert div elements to button elements so they gain tabbing and enter/space interaction for free

function toggleHidden(indicators: HTMLElement, images: HTMLElement) {
	// Toggle which one is shown
	indicators.hidden = !indicators.hidden;
	images.hidden = !images.hidden;
	// Also toggle clear button
	const clearUploadsButton = document.getElementById("clear-uploads") as HTMLButtonElement;
	if (!clearUploadsButton) throw new Error("Fatal Error: Failed to locate #clear-uploads");
	clearUploadsButton.disabled = !clearUploadsButton.disabled;
}

// IDEA: Refactor this file into a form class that gets all its elements by ID once and keeps them available for its functions
