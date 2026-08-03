import formHTMLRaw from "./form.html?raw";
import "./form.css";
import { registerPage, renderPage } from "@/components/renderPage";
import { setUserData } from "@/state/UserData";

abstract class Page {
	getEl<ElementType extends HTMLElement = HTMLElement>(elementName: string): ElementType {
		const element = document.getElementById(elementName) as ElementType;
		if (!element) throw new Error(`Fatal Error: Failed to locate #${elementName}`);
		return element;
	}
}

class FormPage extends Page {
	private formFileInput = this.getEl<HTMLInputElement>("form-file-input");
	private formUploadContainer = this.getEl("form-upload-area");
	private clearUploadsButton = this.getEl<HTMLButtonElement>("clear-uploads");
	private uploadsContainer = this.getEl("upload-image-container");
	private uploadIndicators = this.getEl("upload-indicators");
	private formView = this.getEl("form-view");
	private titleInput = this.getEl<HTMLInputElement>("form-title-input");
	private descInput = this.getEl<HTMLInputElement>("form-desc-input");
	private collectedURLs: string[] = [];
	constructor() {
		super();
		/* ------------------------- Add Event Interactions ------------------------- */
		// Form Image Input
		this.formFileInput.addEventListener("change", () => this.handleFiles(this.formFileInput.files));
		// Form Image Container
		this.formUploadContainer.addEventListener("click", () => this.formFileInput.click());
		this.formUploadContainer.addEventListener("dragover", (event) => {
			event.preventDefault();
			this.formUploadContainer.classList.add("drag-active");
		});
		this.formUploadContainer.addEventListener("dragleave", () => this.formUploadContainer.classList.remove("drag-active"));
		this.formUploadContainer.addEventListener("drop", (event) => {
			event.preventDefault();
			this.formUploadContainer.classList.remove("drag-active");
			this.handleFiles(event.dataTransfer?.files);
		});
		// Form Image Clear button
		this.clearUploadsButton.addEventListener("click", () => {
			this.uploadsContainer
				.querySelectorAll("img.uploaded-image")
				.forEach((image) => URL.revokeObjectURL((image as HTMLImageElement).src));
			this.uploadsContainer.hidden = true;
			this.uploadIndicators.hidden = false;
			this.clearUploadsButton.disabled = true;
		});
		// Form Submission button
		this.formView.addEventListener("submit", (event) => {
			event.preventDefault(); // Prevent submission auto-send
			setUserData(this.titleInput.value, this.descInput.value, this.collectedURLs);
			renderPage("rankup");
		});
	}

	/**
	 * Deals with files collected from drag-drop or explorer selection, ensuring they are images.
	 *
	 * @param files List of files received as input to upload container.
	 */
	private handleFiles(files: FileList | undefined | null) {
		if (!files) throw new Error("Fatal Error: #form-file-input's FileList object was invalid.");

		/* ------------------------ Confirm we received files ----------------------- */
		if (files.length < 1) {
			console.warn("Dragged in non-file, likely from a webpage. This is not currently supported.");
			return;
		}

		/* --------------------- Loop through images and display -------------------- */
		for (const file of files) {
			if (!file.type.startsWith("image/")) {
				console.warn(`Tried to upload non-image: ${file.name}`);
				continue; // Skip non-images
			}

			// Make a wrapper to contain image elements
			const imageWrapper = document.createElement("div") as HTMLDivElement;
			imageWrapper.className = "image-wrapper";
			this.uploadsContainer.append(imageWrapper);

			// Make the image file into an HTML Image element to insert
			const newImage = document.createElement("img") as HTMLImageElement;
			newImage.className = "uploaded-image";
			const imageURL = URL.createObjectURL(file);
			newImage.src = imageURL;
			this.collectedURLs.push(imageURL);
			imageWrapper.append(newImage);

			// Make the delete button
			const deleteButton = document.createElement("button") as HTMLButtonElement;
			deleteButton.className = "delete-button";
			deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;
			deleteButton.addEventListener("click", (event) => {
				event.stopPropagation();
				imageWrapper.remove();
				URL.revokeObjectURL(newImage.src);
				const index = this.collectedURLs.indexOf(imageURL);
				if (index !== -1) this.collectedURLs.splice(index, 1);
				if (!this.uploadsContainer.hasChildNodes()) this.hideIndicators(false);
			});
			imageWrapper.append(deleteButton);
		}
		if (this.uploadsContainer.hasChildNodes()) this.hideIndicators(true);
	}

	/**
	 * Swaps whether upload indicators or upload container are enabled
	 *
	 * @param newState whether to set indicators to true or false
	 */
	private hideIndicators(newState: boolean) {
		this.uploadIndicators.hidden = newState;
		this.uploadsContainer.hidden = !newState;
		this.clearUploadsButton.disabled = !newState;
	}
}

async function renderFormPage(pageContainer: HTMLElement) {
	/* --------------------- Inject raw HTML into container --------------------- */
	pageContainer.innerHTML = formHTMLRaw;
	/* ----------------------- Add functionality via class ---------------------- */
	new FormPage();
}

// Register this page to the page renderer
registerPage("form", renderFormPage);
