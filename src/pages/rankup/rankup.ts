import "@/pages/rankup/rankup.css"; // Styling for our Rankup Page
import Sortable from "sortablejs";

// Import our Images
import addRowAboveIcon from "@/assets/images/addRowAboveIcon.png";
import addRowBelowIcon from "@/assets/images/addRowBelowIcon.png";
import dragHandleIcon from "@/assets/images/DragHandleIcon.png";
import rowHeaderClearIcon from "@/assets/images/RowHeaderClear.png";
import rowHeaderDeleteIcon from "@/assets/images/RowHeaderDelete.png";
import emptyImage from "@/assets/images/empty.png";
import * as Utils from "@/utils/utils";
import rankupHTMLRaw from "./rankup.html?raw";
import { registerPage } from "@/components/renderPage";
import { getUserData } from "@/state/UserData";

const STARTING_ROW_COUNT = 5;
const PLACEHOLDER_IMAGES = ["bird", "bird_evil", "BordBlue", "BordGreen", "BordPink", "BordPorple", "BordRee", "BordWhite", "BordYellow"];

interface KeyPairList {
	[key: string]: number;
}

class RankUpPage {
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

class Row extends HTMLElement {
	private rowHeader = document.createElement("div"); // Contains row title, status buttons, and drag tab
	private rowTab = document.createElement("div"); // Contains drag handle and buttons for adding row above or below
	private addRowAboveButton = document.createElement("img"); // Adds new row above current
	private dragContainer = document.createElement("div"); // Contains drag handle image and allows row to be reordered
	private dragHandle = document.createElement("img"); // Image to indicate dragable row
	private addRowBelowButton = document.createElement("img"); // Adds new row below current
	private rowTitle = document.createElement("input"); // Title for current row
	private statusBtnsContainer = document.createElement("div"); // Contains buttons for changing row's status
	private deleteButton = document.createElement("div"); // Deletes the current row
	private clearButton = document.createElement("div"); // Clears out current row
	private rowBody = document.createElement("div"); // Contains the actual images for this row

	/**
	 * Creates a Row element
	 *
	 * @param page the RankUpPage instance holding this row
	 * @param rowNumber index to initialize row's name with
	 */
	constructor(page: RankUpPage, rowNumber = 0) {
		super();
		this.className = "rowFull";
		this.rowHeader.className = "rowHeader rowPiece";
		this.rowHeader.onmouseover = () => page.showTab(this.rowTab); // show the rowTab
		this.rowHeader.onmouseout = () => page.hideTab(this.rowTab); // hide the rowTab
		this.rowTab.className = "rowTab rowPiece closed";
		this.rowTab.onclick = (event) => event.stopPropagation();
		this.addRowAboveButton.className = "tabButton addRowButton addRowAboveButton";
		this.addRowAboveButton.src = addRowAboveIcon;
		this.addRowAboveButton.onclick = () => page.addRow(this, true);
		this.addRowAboveButton.ondragstart = (event) => event.preventDefault();
		this.dragContainer.className = "tabButton dragContainer";
		this.dragHandle.className = "dragHandle";
		this.dragHandle.src = dragHandleIcon;
		this.dragHandle.draggable = false;
		this.dragHandle.ondragstart = (event) => event.preventDefault();
		this.dragContainer.append(this.dragHandle);
		this.addRowBelowButton.className = "tabButton addRowButton addRowBelowButton";
		this.addRowBelowButton.src = addRowBelowIcon;
		this.addRowBelowButton.onclick = () => page.addRow(this, false);
		this.addRowBelowButton.ondragstart = (event) => event.preventDefault();
		this.rowTab.append(this.addRowAboveButton, this.dragContainer, this.addRowBelowButton);
		this.rowTitle.className = "rowTitle";
		this.rowTitle.placeholder = rowNumber ? "Row " + rowNumber : "New Row";
		this.rowTitle.ondrop = (event) => page.draggedOntoTextBox(event);
		this.statusBtnsContainer.className = "resetDeleteContainer";
		this.clearButton.className = "resetButton resetDeleteButton";
		this.clearButton.style.backgroundImage = `url("${rowHeaderClearIcon}")`; // Set background image for clear button
		this.clearButton.onclick = () => page.clearRow(this);
		this.deleteButton.className = "deleteButton resetDeleteButton";
		this.deleteButton.style.backgroundImage = `url("${rowHeaderDeleteIcon}")`; // Set background image for delete button
		this.deleteButton.onclick = () => page.deleteRow(this);
		this.statusBtnsContainer.append(this.clearButton, this.deleteButton);
		this.statusBtnsContainer.onclick = (event) => event.stopPropagation();
		this.rowHeader.append(this.rowTab, this.rowTitle, this.statusBtnsContainer);
		this.rowBody.className = "rowBody rowPiece image-container";
		this.rowBody.ondragover = (event) => page.dragImageOver(event);
		this.rowBody.ondragend = () => page.dragImageEnd();
		this.append(this.rowHeader, this.rowBody);
	}

	/**
	 * Gets a list of the images inside of the current row
	 *
	 * @returns images in row
	 */
	getImages(): HTMLImageElement[] {
		return Array.from(this.rowBody.children) as HTMLImageElement[];
	}

	/**
	 * Enables or disables delete button on the row
	 *
	 * @param enable whether or not to enable the delete button
	 */
	setEnableDelete(enable: boolean) {
		enable ? this.deleteButton.classList.remove("disabled") : this.deleteButton.classList.add("disabled");
	}
}

function renderRankUpPage(pageContainer: HTMLElement) {
	RankUpPage.mountTo(pageContainer);
}

// Define row class as custom element
customElements.define("rankup-row", Row);
// Register this page to the renderer
registerPage("rankup", renderRankUpPage);
