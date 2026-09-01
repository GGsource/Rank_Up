import "@/pages/rankup/rankup.css"; // Styling for our Rankup Page
import Sortable from "sortablejs";
import emptyImage from "@/assets/images/empty.png";
import * as Utils from "@/utils/utils";
import rankupHTMLRaw from "./rankup.html?raw";
import { registerPage } from "@/components/renderPage";
import { getUserData } from "@/state/UserData";
import { Row, RowList } from "@/components/Row";

const STARTING_ROW_COUNT = 5;
const PLACEHOLDER_IMAGES = ["bird", "bird_evil", "BordBlue", "BordGreen", "BordPink", "BordPorple", "BordRee", "BordWhite", "BordYellow"];

interface KeyPairList {
	[key: string]: number;
}

class RankUpPage implements RowList {
	private rowView = Utils.getEl("rankup-view");
	private rowList = Utils.getEl("rowList");
	private imageContainer = Utils.getEl("imageContainer");
	private headerTitle = Utils.getEl<HTMLInputElement>("headerTitle");
	private headerDescription = Utils.getEl<HTMLInputElement>("headerDescription");
	private isRowBeingDragged = false;
	private timeoutIds: KeyPairList = {};
	private lastHiddenTab: HTMLDivElement | null = null;
	private selectedImages: Set<HTMLImageElement> = new Set();
	private lastSelectedImage: HTMLImageElement | null = null;
	private prevTarget: HTMLElement | null = null;
	private isPrevSideLeft: boolean = false;
	private userData = getUserData();
	private readonly emptyImg = new Image();

	// DOCS: Mounter
	static mountTo(pageContainer: HTMLElement) {
		pageContainer.innerHTML = rankupHTMLRaw;
		return new RankUpPage();
	}

	// DOCS: Constructor
	private constructor() {
		/* ------------------------------- Attach Rows ------------------------------ */
		for (let rowNum: number = 1; rowNum <= STARTING_ROW_COUNT; rowNum++) this.rowList.append(new Row(this, rowNum));
		this.makeRowsDraggable();
		this.emptyImg.src = emptyImage;
		/* ---------------------------- Attach Listeners ---------------------------- */
		this.rowView.addEventListener("click", () => this.clearSelections());
		// Main container behaviors
		this.imageContainer.ondragover = (event) => this.dragImageOver(event);
		this.imageContainer.ondragend = () => this.dragImageEnd();
		// Text boxes behaviors
		this.headerTitle.ondragover = (event) => this.draggedOntoTextBox(event);
		this.headerDescription.ondragover = (event) => this.draggedOntoTextBox(event);
		/* ------------------------------ Insert images ----------------------------- */
		if (this.userData) {
			this.headerTitle.value = this.userData.title;
			this.headerDescription.value = this.userData.desc;
			if (this.userData.imageURLs.length > 0) this.userData.imageURLs.forEach((url) => this.addImageToContainer(url));
			else
				PLACEHOLDER_IMAGES.forEach((name) =>
					this.addImageToContainer(new URL(`../../assets/images/${name}.png`, import.meta.url).href),
				);
		}
	}

	// DOCS: Function to add drag ability with Sortable JS
	makeRowsDraggable() {
		new Sortable(this.rowList, {
			draggable: ".rowFull", // The thing to be dragged
			handle: ".dragContainer", // The thing to grab to drag by
			direction: "vertical",
			animation: 180,
			easing: "cubic-bezier(0.22,1,0.36,1)",
			ghostClass: "rowSortGhost",
			ignore: "a",
			onStart: (event) => {
				this.isRowBeingDragged = true;
				// Add the dragging class for styling
				const dragContainer = event.item.querySelector<HTMLDivElement>(".dragContainer");
				dragContainer?.classList.add("is-row-dragging");
			},
			onEnd: (event) => {
				this.isRowBeingDragged = false;
				// Hide the row tab when drag has ended
				const rowTab = event.item.querySelector<HTMLDivElement>(".rowTab");
				if (rowTab) this.hideTab(rowTab);
				// Remove the dragging class for styling
				const dragContainer = event.item.querySelector<HTMLDivElement>(".dragContainer");
				dragContainer?.classList.remove("is-row-dragging");
			},
		});
	}

	// DOCS: AddRow - Adds a new row above or below the specified row.
	addRow(row: Row, isAbove: boolean) {
		// First check if there is only one row remaining, if so, enable the delete button and make it look enabled.
		if (this.rowList.childElementCount == 1) {
			const onlyRow = this.rowList.firstChild as Row;
			onlyRow.setEnableDelete(true);
		}
		// Create the new row
		const insertDirection = isAbove ? "beforebegin" : "afterend";
		row.insertAdjacentElement(insertDirection, new Row(this));
	}

	// DOCS: clearRow - Resets a specified row to be empty, moving children back to imageContanier.
	clearRow(row: Row) {
		row.getImages().forEach((image) => {
			this.deselectImage(image);
			this.imageContainer.append(image);
		});
	}

	// DOCS: DeleteRow - Deletes a specified row and moves any contents to the imageContainer at the bottom of the page.
	deleteRow(row: Row) {
		this.clearRow(row);
		row.remove();
		// If there is only one row remaining disable the delete button and make it look disabled.
		if (this.rowList.childElementCount <= 1) {
			const onlyRow = this.rowList.firstChild as Row;
			onlyRow.setEnableDelete(false);
		}
	}

	// FIXME: This is now broken
	// DOCS:
	showTab(tab: HTMLDivElement) {
		if (this.lastHiddenTab && this.lastHiddenTab != tab) {
			this.hideTab(this.lastHiddenTab, false);
		}
		clearTimeout(this.timeoutIds[tab.id]);
		tab.classList.remove("closed");
		this.lastHiddenTab = tab;
	}

	// DOCS:
	hideTab(tab: HTMLDivElement, useDelay: boolean = true) {
		if (this.isRowBeingDragged) return;
		if (this.timeoutIds[tab.id]) clearTimeout(this.timeoutIds[tab.id]); // Clear any existing timeout
		let delayMS: number = useDelay ? 500 : 0; // If delay is enabled, then we'll do half a second
		this.timeoutIds[tab.id] = setTimeout(() => {
			tab.classList.add("closed");
		}, delayMS);
	}

	// DOCS:
	clickImage(ev: MouseEvent) {
		ev.stopPropagation(); // Stop event from moving up to prevent clearing
		const image = ev.target as HTMLImageElement;
		if (!image) throw new Error("Fatal Error: Clicked image but it is null...");
		const container = image.parentNode;
		if (!container) throw new Error("Fatal Error: Image's parent container null...");

		// Get our index
		const images = Array.from(container.children) as HTMLImageElement[];
		const currentNdx = images.indexOf(image);

		// TESTME: What if you CTRL deselect an image and then shift click to another? What are the bounds?
		// Ctrl key + click to toggle selected status on an image
		if (ev.ctrlKey) this.toggleSelection(image);
		else if (ev.shiftKey && this.lastSelectedImage) {
			// Shift key + click selects all images between last and current image
			const lastNdx = images.indexOf(this.lastSelectedImage);
			if (lastNdx !== -1) {
				const start = Math.min(currentNdx, lastNdx);
				const end = Math.max(currentNdx, lastNdx);
				for (let i = start; i <= end; i++) this.selectImage(images[i]);
			} else this.selectImage(image);
		} else {
			// Normal image click, only select the one image
			this.clearSelections();
			this.selectImage(image);
		}
		this.lastSelectedImage = image;
	}

	// DOCS: // Selects an image
	private selectImage(image: HTMLImageElement) {
		this.selectedImages.add(image);
		image.classList.add("selectedImage");
	}

	// DOCS: // Unselects an image
	deselectImage(image: HTMLImageElement) {
		this.selectedImages.delete(image);
		image.classList.remove("selectedImage");
	}

	// DOCS: Flips selected status on a given image
	private toggleSelection(image: HTMLImageElement) {
		this.selectedImages.has(image) ? this.deselectImage(image) : this.selectImage(image);
	}

	// DOCS: // Clears the list of currently selected images
	private clearSelections() {
		for (const image of this.selectedImages) this.deselectImage(image);
		this.selectedImages.clear();
	}

	// DOCS: DragStart - Mouse is now being held on an image; it is being dragged.
	imageDragStart(event: DragEvent) {
		this.rowView.classList.remove("allow-image-hover"); // Disallow hover effects, we're holding it
		const draggedImage = event.target as HTMLImageElement;
		if (!draggedImage) throw new Error("Fatal Error: Failed to drag image because it is null...");

		// If this image isn't one of the currently selected, click it to select it and deselect the previously selected
		if (!this.selectedImages.has(draggedImage)) this.clickImage(event);

		// Attach dragging data and class to all participants
		this.selectedImages.forEach((selectedImage) => selectedImage.classList.add("draggingImage"));

		// Disable the default dragging image
		if (!event.dataTransfer) throw new Error("ev.dataTransfer is null in DragStart");
		event.dataTransfer.setDragImage(this.emptyImg, 0, 0);
	}

	// DOCS: DragImageOver - Mouse is being held and dragged over some target. That target receives this event.
	dragImageOver(event: DragEvent) {
		// For change to be necessary one of these must have changed: target changed, targetside changed.
		event.preventDefault();

		const element = event.target as HTMLElement; // The element being dragged into.
		if (!element) console.error("ev.target is is null in DragImageOver");

		if (element.classList.contains("image-container")) {
			this.selectedImages.forEach((selectedImage) => {
				if (this.prevTarget == element && selectedImage.nextElementSibling == null) return; //Same container & position, nothin should change.
				element.append(selectedImage);
			});
		} else if (element.classList.contains("rankingImage")) {
			const targetImage = element as HTMLImageElement;
			// The user dragged an image onto another image, place the image next to the target image in its parent.
			if (this.selectedImages.has(targetImage)) return; //Selected imgs need to ignore eachother
			// Check if the image was dragged to the left or right of the target image
			const targetImageRect = targetImage.getBoundingClientRect();
			const targetImageCenter = targetImageRect.left + targetImageRect.width / 2;
			// If the user dragged the image to the left of the target image, insert the image before the target image
			const isCurSideLeft = event.clientX < targetImageCenter;
			if (this.prevTarget == element && isCurSideLeft == this.isPrevSideLeft) return;
			this.selectedImages.forEach((selectedImage) => {
				if (isCurSideLeft) targetImage.insertAdjacentElement("beforebegin", selectedImage);
				else this.recursiveInsert(targetImage);
			});
			this.isPrevSideLeft = isCurSideLeft;
		}
		this.prevTarget = element;
	}

	// TODO: Rename to be in line with other function
	// DOCS: DragImageEnd - Mouse dragging ends. The element that was being dragged receives this event.
	dragImageEnd() {
		this.prevTarget = null;
		this.isPrevSideLeft = false;
		this.rowView.classList.add("allow-image-hover");
		this.selectedImages.forEach((selectedImage) => selectedImage.classList.remove("draggingImage"));
	}

	// DOCS: RecursiveInsert - Recursively places images one after the other. Required to avoid looping behavior
	private recursiveInsert(targetImage: HTMLImageElement) {
		let iterator: IterableIterator<HTMLImageElement> = this.selectedImages.values();
		this._recursiveInsert(targetImage, iterator);
	}
	private _recursiveInsert(targetImage: HTMLImageElement, iterator: IterableIterator<HTMLImageElement>) {
		let nextImg = iterator.next();
		if (!nextImg.done) {
			targetImage.insertAdjacentElement("afterend", nextImg.value);
			this._recursiveInsert(nextImg.value, iterator);
		}
	}
	// TODO: Replace recursive functions with single one. not necessary

	// DOCS: dragOverTextBox - drop function for dragging something onto an object that should only hold text, such as a row header.
	draggedOntoTextBox(event: DragEvent) {
		const data = event.dataTransfer;
		if (data && (data.types.length != 1 || data.types[0] != "text/plain")) event.preventDefault();

		const element = event.target as HTMLElement;
		// DEBUGGING:
		console.warn(`Dragged something over ${element.id} but this is an invalid drag target`);
		console.warn("Data: ", data);
	}

	// DOCS:
	private addImageToContainer(url: string) {
		const image = document.createElement("img") as HTMLImageElement;
		image.className = "rankingImage";
		image.src = url;
		image.onclick = (event) => this.clickImage(event);
		image.ondragstart = (event) => this.imageDragStart(event);
		this.imageContainer.appendChild(image);
	}
}

function renderRankUpPage(pageContainer: HTMLElement) {
	RankUpPage.mountTo(pageContainer);
}

// Define row class as custom element
customElements.define("rankup-row", Row);
// Register this page to the renderer
registerPage("rankup", renderRankUpPage);
