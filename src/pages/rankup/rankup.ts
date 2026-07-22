import "@/pages/rankup/rankup.css"; // Styling for our Rankup Page
import Sortable from "sortablejs";

// Import our Images
import addRowAboveIcon from "@/assets/images/addRowAboveIcon.png";
import addRowBelowIcon from "@/assets/images/addRowBelowIcon.png";
import dragHandleIcon from "@/assets/images/DragHandleIcon.png";
import rowHeaderClearIcon from "@/assets/images/RowHeaderClear.png";
import rowHeaderDeleteIcon from "@/assets/images/RowHeaderDelete.png";
import emptyImage from "@/assets/images/empty.png";

class Row {
	static count: number = 1; // Keep track of number of rows created
	rowFull: HTMLDivElement = document.createElement("div");
	rowBody: HTMLDivElement = document.createElement("div");
	constructor(isNewRow = false) {
		// RowFull is the main container for the row. It contains the rowHeader and the rowBody.
		this.rowFull.className = "rowFull";
		this.rowFull.id = "rowFull" + Row.count;
		// rowHeader consists of the title on the left, and the delete and reset buttons on the right side corners. The reset button is in the top right corner, and the delete button is in the bottom right corner. This can be done with a flexbox and an empty between the two buttons vertically.
		let rowHeader: HTMLDivElement = document.createElement("div");
		rowHeader.className = "rowHeader rowPiece";
		rowHeader.id = "rowHeader" + Row.count;
		// rowTab consists of an addRowAbove button, an addRowBelow button, and a drag handle in between, stacked vertically.
		let rowTab: HTMLDivElement = document.createElement("div");
		rowTab.className = "rowTab rowPiece closed";
		rowTab.id = "rowTab" + Row.count;
		rowHeader.onmouseover = () => showTab(rowTab); // show the rowTab
		rowHeader.onmouseout = () => hideTab(rowTab); // hide the rowTab
		// Add the addRowAbove button, the addRowBelow button, and the drag handle to the rowTab
		let addRowAboveButton: HTMLImageElement = document.createElement("img");
		addRowAboveButton.className = "tabButton addRowButton addRowAboveButton";
		addRowAboveButton.src = addRowAboveIcon;
		addRowAboveButton.onclick = () => addRow(this.rowFull, true);
		addRowAboveButton.ondragstart = (event) => event.preventDefault();
		let dragContainer: HTMLDivElement = document.createElement("div");
		dragContainer.className = "tabButton dragContainer";
		let dragHandle: HTMLImageElement = document.createElement("img");
		dragHandle.className = "dragHandle";
		dragHandle.src = dragHandleIcon;
		dragHandle.draggable = false;
		dragHandle.ondragstart = (event) => event.preventDefault();
		dragContainer.appendChild(dragHandle);
		let addRowBelowButton: HTMLImageElement = document.createElement("img");
		addRowBelowButton.className = "tabButton addRowButton addRowBelowButton";
		addRowBelowButton.src = addRowBelowIcon;
		addRowBelowButton.onclick = () => addRow(this.rowFull, false);
		addRowBelowButton.ondragstart = (event) => event.preventDefault();
		// Add the buttons to the rowTab
		rowTab.appendChild(addRowAboveButton);
		rowTab.appendChild(dragContainer);
		rowTab.appendChild(addRowBelowButton);
		// Add the title to the rowHeader
		let rowTitle: HTMLInputElement = document.createElement("input");
		rowTitle.className = "rowTitle";
		rowTitle.id = "rowTitle" + Row.count;
		rowTitle.placeholder = isNewRow ? "New Row" : "Row " + Row.count;
		rowTitle.ondrop = (event) => draggedOntoTextBox(event);
		rowTitle.onfocus = () => clearSelections();
		// Add a vertical div containing the reset button, an empty div, and the delete button to the rowHeader
		let resetDeleteContainer: HTMLDivElement = document.createElement("div");
		resetDeleteContainer.className = "resetDeleteContainer";
		resetDeleteContainer.id = "resetDeleteContainer" + Row.count;
		let resetButton: HTMLDivElement = document.createElement("div");
		resetButton.className = "resetButton resetDeleteButton";
		resetButton.id = "resetButton" + Row.count;
		resetButton.style.backgroundImage = `url("${rowHeaderClearIcon}")`; // Set background image for clear button
		resetButton.onclick = () => resetRow(this.rowBody);
		let deleteButton: HTMLDivElement = document.createElement("div");
		deleteButton.className = "deleteButton resetDeleteButton";
		deleteButton.id = "deleteButton" + Row.count;
		deleteButton.style.backgroundImage = `url("${rowHeaderDeleteIcon}")`; // Set background image for delete button
		deleteButton.onclick = () => deleteRow(this.rowFull);
		resetDeleteContainer.appendChild(resetButton);
		resetDeleteContainer.appendChild(deleteButton);
		// Add the rowTitle and the resetDeleteContainer to the rowHeader
		rowHeader.appendChild(rowTab);
		rowHeader.appendChild(rowTitle);
		rowHeader.appendChild(resetDeleteContainer);
		// Add the rowHeader to the full row
		this.rowFull.appendChild(rowHeader);
		// rowBody will be the element that contains the row's ranking images.
		this.rowBody.className = "rowBody rowPiece image-container";
		this.rowBody.onclick = (event) => clickContainer(event);
		this.rowBody.ondragover = (event) => dragImageOver(event);
		this.rowBody.ondragend = (event) => dragImageEnd(event);
		resetButton.onclick = () => resetRow(this.rowBody);
		// Add the rowBody to the Row
		this.rowFull.appendChild(this.rowBody);
		Row.count++;
	}
	// Function for appending this row to a parent element
	appendTo(parent: HTMLElement) {
		parent.appendChild(this.rowFull);
	}
}

let draggingImageDiv: HTMLDivElement;
let emptyImg: HTMLImageElement = new Image();
emptyImg.src = emptyImage;
let selectedImages: Set<HTMLImageElement> = new Set();
let lastSelectedImage: HTMLImageElement;
// DragStart - Mouse is now being held on an image; it is being dragged.
function dragStart(ev: DragEvent) {
	const rankupContainer = document.getElementsByClassName("rankup-view")[0];
	rankupContainer?.classList.remove("allow-image-hover"); // Disallow hover effects, we're holding it
	let image: HTMLImageElement | null = ev.target as HTMLImageElement | null;
	if (image) {
		if (!selectedImages.has(image)) clickImage(ev);
		selectedImages.forEach((selectedImage) => {
			selectedImage.setAttribute("data-dragging", "true");
			selectedImage.classList.add("draggingImage");
		});
		// At this point selectedImages contains all the items we want to drag. Show the user how many items theyre dragging
		draggingImageDiv = document.createElement("div");
		draggingImageDiv.style.position = "absolute";
		draggingImageDiv.style.zIndex = (1000).toString(); //Arbitrarily high, above anything else.
		draggingImageDiv.style.width = `${image.width}px`;
		draggingImageDiv.style.height = `${image.height}px`;
		draggingImageDiv.style.backgroundColor = "#f0f0f055";
		draggingImageDiv.style.border = `${1}px solid #000`;
		draggingImageDiv.style.borderRadius = `${10}%`;
		draggingImageDiv.style.textAlign = "center";
		draggingImageDiv.style.font = `${2}em 'Alice', sans-serif`;
		draggingImageDiv.textContent = selectedImages.size.toString(); // How many images are selected
		document.body.appendChild(draggingImageDiv);
		// Update the div position
		updateDragDivPosition(ev);
		// Disable the default dragging image
		if (ev.dataTransfer) {
			ev.dataTransfer.setDragImage(emptyImg, 0, 0);
		} else {
			console.error("ev.dataTransfer is null in DragStart");
		}
	} else {
		console.error("Tried to drag image but it's null in DragStart");
	}
}

// DragImage - Mouse is being held and dragged.
function dragImage(ev: DragEvent) {
	if (draggingImageDiv) {
		updateDragDivPosition(ev);
	}
}

let prevTarget: HTMLElement;
let isPrevSideLeft: boolean;
// DragImageOver - Mouse is being held and dragged over some target. That target receives this event.
function dragImageOver(ev: DragEvent) {
	// For change to be necessary one of these must have changed: target changed, targetside changed.
	ev.preventDefault();
	let sources: NodeListOf<Element> = document.querySelectorAll("[data-dragging]");
	let element: HTMLElement | null = ev.target as HTMLElement | null; // The element being dragged into.
	if (element) {
		if (element.classList.contains("image-container")) {
			sources.forEach((source) => {
				if (prevTarget == element && source.nextElementSibling == null) return; //Same container & position, nothin should change.
				element.appendChild(source);
			});
		} else if (element.classList.contains("rankingImage")) {
			let imageElement: HTMLImageElement = element as HTMLImageElement;
			// The user dragged an image onto another image, place the image next to the target image in its parent.
			if (selectedImages.has(imageElement)) return; //Selected imgs need to ignore eachother
			// Check if the image was dragged to the left or right of the target image
			let targetImageRect: DOMRect = imageElement.getBoundingClientRect();
			let targetImageCenter: number = targetImageRect.left + targetImageRect.width / 2;
			// If the user dragged the image to the left of the target image, insert the image before the target image
			let isCurSideLeft: boolean = ev.clientX < targetImageCenter ? true : false;
			if (prevTarget == element && isCurSideLeft == isPrevSideLeft) return;
			sources.forEach((source) => {
				if (isCurSideLeft) imageElement.insertAdjacentElement("beforebegin", source);
				else recursiveInsert(imageElement);
			});
			isPrevSideLeft = isCurSideLeft;
		}
		prevTarget = element;
	} else {
		console.error("ev.target is is null in DragImageOver");
	}
}

// DragImageEnd - Mouse dragging ends. The element that the dragging ended on receives this event.
function dragImageEnd(ev: DragEvent) {
	const rankupContainer = document.getElementsByClassName("rankup-view")[0];
	rankupContainer?.classList.add("allow-image-hover");
	var sources = document.querySelectorAll("[data-dragging]");
	sources.forEach((source) => {
		source.classList.remove("draggingImage");
		source.removeAttribute("data-dragging");
	});
	draggingImageDiv.remove();
}

// UpdateDragDivPosition - updates where the div should be as mouse moves
function updateDragDivPosition(ev: DragEvent) {
	draggingImageDiv.style.left = `${ev.pageX}px`;
	draggingImageDiv.style.top = `${ev.pageY}px`;
}

// RecursiveInsert - Recursively places images one after the other. Required to avoid looping behavior
function recursiveInsert(image: HTMLImageElement) {
	let iterator: IterableIterator<HTMLImageElement> = selectedImages.values();
	_recursiveInsert(image, iterator);
}
function _recursiveInsert(image: HTMLImageElement, iterator: IterableIterator<HTMLImageElement>) {
	let nextImg = iterator.next();
	if (!nextImg.done) {
		image.insertAdjacentElement("afterend", nextImg.value);
		_recursiveInsert(nextImg.value, iterator);
	}
}

// ResetRow - Resets a specified row to be empty, moving children back to imageContanier.
function resetRow(rowBody: HTMLDivElement) {
	if (rowBody.hasChildNodes()) {
		let imageContainer = document.getElementById("imageContainer");
		if (imageContainer) {
			// Check the container is not null
			if (rowBody.firstChild) {
				// Check firstChild is not null
				while (rowBody.hasChildNodes()) {
					imageContainer.appendChild(rowBody.firstChild);
				}
			}
		} else {
			console.error("Tried to get imageCountainer while resetting a row but it's null.");
		}
	}
}

// DeleteRow - Deletes a specified row and moves any contents to the imageContainer at the bottom of the page.
function deleteRow(row: HTMLDivElement) {
	// First check if this row had any images in it, if so, move them to the imageContainer
	let rowBody: HTMLDivElement = row.getElementsByClassName("rowBody")[0] as HTMLDivElement;
	resetRow(rowBody);
	// Remove the row from the rowList
	row.remove();
	// If there is only one row remaining disable the delete button and make it look disabled.
	let rowList = document.getElementById("rowList");
	if (rowList && rowList.childElementCount == 1) {
		let deleteButton: HTMLDivElement = rowList.getElementsByClassName("deleteButton")[0] as HTMLDivElement;
		deleteButton.style.pointerEvents = "none";
		deleteButton.style.opacity = `${0.2}`;
	}
}

// AddRow - Adds a new row above or below the specified row.
function addRow(row: HTMLDivElement, isAbove: boolean) {
	// First check if there is only one row remaining, if so, enable the delete button and make it look enabled.
	var rowList = document.getElementById("rowList");
	if (rowList && rowList.childElementCount == 1) {
		let deleteButton: HTMLDivElement = rowList.getElementsByClassName("deleteButton")[0] as HTMLDivElement;
		deleteButton.style.pointerEvents = "auto";
		deleteButton.style.opacity = `${1}`;
	}
	// Create the new row
	if (isAbove) row.insertAdjacentElement("beforebegin", new Row(true).rowFull);
	else row.insertAdjacentElement("afterend", new Row(true).rowFull);
}

interface KeyPairList {
	[key: string]: number;
}
let timeoutIds: KeyPairList = {};
let lastHiddenTab: HTMLDivElement;

function showTab(tab: HTMLDivElement) {
	if (lastHiddenTab && lastHiddenTab != tab) {
		hideTab(lastHiddenTab, false);
	}
	clearTimeout(timeoutIds[tab.id]);
	tab.classList.remove("closed");
	lastHiddenTab = tab;
}

function hideTab(tab: HTMLDivElement, useDelay: boolean = true) {
	if (isRowBeingDragged) return;
	if (timeoutIds[tab.id]) clearTimeout(timeoutIds[tab.id]); // Clear any existing timeout
	let delayMS: number = useDelay ? 500 : 0; // If delay is enabled, then we'll do half a second
	timeoutIds[tab.id] = setTimeout(() => {
		tab.classList.add("closed");
	}, delayMS);
}

window.addEventListener("keydown", function (ev: KeyboardEvent) {
	if (ev.key == "Control" || ev.key == "Shift") {
		ev.preventDefault();
	}
});

function clickImage(ev: MouseEvent) {
	let image: HTMLImageElement | null = ev.target as HTMLImageElement | null;
	if (image) {
		let container: HTMLDivElement = image.parentNode as HTMLDivElement;
		let images: HTMLImageElement[] = Array.from(container.children) as HTMLImageElement[];
		let index: number = images.indexOf(image);

		if (ev.ctrlKey)
			// Ctrl key + click to toggle selected status on an image
			toggleSelection(image);
		else if (ev.shiftKey && lastSelectedImage) {
			// Shift key + click selects all images between last and current image
			let lastIndex: number = images.indexOf(lastSelectedImage);
			if (lastIndex !== -1) {
				let start: number = Math.min(index, lastIndex);
				let end: number = Math.max(index, lastIndex);
				for (let i = start; i <= end; i++) {
					selectImage(images[i]);
				}
			} else {
				selectImage(image);
			}
		} else {
			// Normal image click, only select the one image
			clearSelections();
			selectImage(image);
		}
		lastSelectedImage = image;
	} else {
		console.log("Image was clicked but returned null.");
	}
}

function selectImage(image: HTMLImageElement) {
	// Selects an image
	selectedImages.add(image);
	image.classList.add("selectedImage");
}

function deselectImage(image: HTMLImageElement) {
	// Unselects an image
	selectedImages.delete(image);
	image.classList.remove("selectedImage");
}

function toggleSelection(image: HTMLImageElement) {
	// Flips selected status on a given image
	if (selectedImages.has(image)) deselectImage(image);
	else selectImage(image);
}

function clearSelections() {
	// Clears the list of currently selected images
	selectedImages.forEach(deselectImage);
	selectedImages.clear();
}

function clickContainer(ev: MouseEvent) {
	// Clears selection when clicking on an empty spot of the container
	let container: HTMLDivElement | null = ev.target as HTMLDivElement | null;
	if (container && container.classList.contains("image-container")) clearSelections();
}

// dragOverTextBox - drop function for dragging something onto an object that should only hold text, such as a row header.
function draggedOntoTextBox(ev: DragEvent) {
	let data = ev.dataTransfer;
	if (data && (data.types.length != 1 || data.types[0] != "text/plain")) {
		ev.preventDefault();
	}
	let element = ev.target as HTMLElement;
	console.log(`Dragged something over ${element.id} but this is an invalid drag target`);
	console.log("Data: ", data);
}

// Function to make the rows on the main page
function populateInitialRows(rowCount: number) {
	let rowList = document.getElementById("rowList") as HTMLDivElement;
	if (rowList) for (let i: number = 0; i < rowCount; i++) new Row().appendTo(rowList);
}
// Function to add in the placeholder images for debugging
function populatePlaceholderImages() {
	let imageNames: string[] = [
		"bird",
		"bird_evil",
		"BordBlue",
		"BordGreen",
		"BordPink",
		"BordPorple",
		"BordRee",
		"BordWhite",
		"BordYellow",
	];
	let imageContainer = document.getElementById("imageContainer") as HTMLDivElement;
	if (imageContainer) {
		imageNames.forEach((name) => {
			let image: HTMLImageElement = document.createElement("img");
			image.className = "rankingImage";
			image.src = new URL(`../../assets/images/${name}.png`, import.meta.url).href;
			image.onclick = (event) => clickImage(event);
			image.ondragstart = (event) => dragStart(event);
			image.ondrag = (event) => dragImage(event);
			imageContainer.appendChild(image);
		});
	} else {
		console.error("Couldn't populate container with placeholders because imageContainer was null.");
	}
}
let isRowBeingDragged: boolean = false;
// Function to add drag ability with Sortable JS
function makeRowsDrag(): void {
	const rowList = document.getElementById("rowList");
	if (!rowList) throw new Error("Could not enable row dragging. rowList was not found.");

	let rowSortable = new Sortable(rowList, {
		draggable: ".rowFull", // The thing to be dragged
		handle: ".dragContainer", // The thing to grab to drag by
		direction: "vertical",
		animation: 180,
		easing: "cubic-bezier(0.22,1,0.36,1)",
		ghostClass: "rowSortGhost",
		onStart(event) {
			isRowBeingDragged = true;
			// Add the dragging class for styling
			const dragContainer = event.item.querySelector<HTMLDivElement>(".dragContainer");
			dragContainer?.classList.add("is-row-dragging");
		},
		onEnd(event) {
			isRowBeingDragged = false;
			// Hide the row tab when drag has ended
			const rowTab = event.item.querySelector<HTMLDivElement>(".rowTab");
			if (rowTab) hideTab(rowTab);
			// Remove the dragging class for styling
			const dragContainer = event.item.querySelector<HTMLDivElement>(".dragContainer");
			dragContainer?.classList.remove("is-row-dragging");
		},
	});
}

import rankupHTMLRaw from "./rankup.html?raw";
import { registerPage } from "@/components/renderPage";

function renderRankUpPage(pageContainer: HTMLElement) {
	/* ------------------------- Inject RankUp page HTML ------------------------ */
	pageContainer.innerHTML = rankupHTMLRaw;

	/* ---------------- Attach class to allow hovering on images ---------------- */
	const rankupContainer = document.getElementsByClassName("rankup-view")[0];
	rankupContainer?.classList.add("allow-image-hover");

	/* ---------------------------- Attach Listeners ---------------------------- */
	const imageContainer = document.getElementById("imageContainer") as HTMLDivElement | null;
	const headerTitle = document.getElementById("headerTitle") as HTMLInputElement | null;
	const headerDescription = document.getElementById("headerDescription") as HTMLTextAreaElement | null;

	/* ------------------------ Main container behaviors ------------------------ */
	if (!imageContainer) throw new Error("Could not find imageContainer, cannot proceed.");
	imageContainer.onclick = clickContainer;
	imageContainer.ondragover = dragImageOver;
	imageContainer.ondragend = dragImageEnd;

	/* -------------------------- Text boxes behaviors -------------------------- */
	if (headerTitle) headerTitle.ondragover = draggedOntoTextBox;
	if (headerDescription) headerDescription.ondragover = draggedOntoTextBox;

	/* ----------- Populate the page with our default rows and images ----------- */
	populateInitialRows(5); // Make the original starting rows
	makeRowsDrag();
	populatePlaceholderImages(); //Put in the placeholders
}

// Register this page to the renderer
registerPage("rankup", renderRankUpPage);
