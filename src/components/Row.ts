import addRowAboveIcon from "@/assets/images/icons/row-add-above.png";
import addRowBelowIcon from "@/assets/images/icons/row-add-below.png";
import dragHandleIcon from "@/assets/images/icons/drag-handle.png";
import rowClearIcon from "@/assets/images/icons/row-clear.png";
import rowDeleteIcon from "@/assets/images/icons/row-delete.png";

/**
 * Defines signature of abilities a list of rows must contain
 */
export interface RowList {
	showTab(tab: HTMLDivElement): void;
	hideTab(tab: HTMLDivElement, useDelay?: boolean): void;
	addRow(row: Row, isAbove: boolean): void;
	clearRow(row: Row): void;
	deleteRow(row: Row): void;
	draggedImageOverElement(event: DragEvent): void;
	stopDraggingImage(): void;
	draggedOverTextbox(event: DragEvent): void;
}

export class Row extends HTMLElement {
	private rowHeader = document.createElement("div"); // Contains row title, status buttons, and drag tab
	private rowTab = document.createElement("div"); // Contains drag handle and buttons for adding row above or below
	private addRowAboveButton = document.createElement("img"); // Adds new row above current
	private dragContainer = document.createElement("div"); // Contains drag handle image and allows row to be reordered
	private dragHandle = document.createElement("img"); // Image to indicate dragable row
	private addRowBelowButton = document.createElement("img"); // Adds new row below current
	private rowTitle = document.createElement("input"); // Title for current row
	private rowOptions = document.createElement("div"); // Contains buttons for changing row's status
	private deleteButton = document.createElement("div"); // Deletes the current row
	private clearButton = document.createElement("div"); // Clears out current row
	private rowBody = document.createElement("div"); // Contains the actual images for this row

	/**
	 * Creates a Row element
	 *
	 * @param page the RankUpPage instance holding this row
	 * @param rowNumber index to initialize row's name with
	 */
	constructor(list: RowList, rowNumber = 0) {
		super();
		this.rowHeader.className = "rowHeader";
		this.rowHeader.onmouseover = () => list.showTab(this.rowTab); // show the rowTab
		this.rowHeader.onmouseout = () => list.hideTab(this.rowTab); // hide the rowTab
		this.rowTab.className = "row-tab closed";
		this.rowTab.onclick = (event) => event.stopPropagation();
		this.addRowAboveButton.className = "tabButton addRowAboveButton";
		this.addRowAboveButton.src = addRowAboveIcon;
		this.addRowAboveButton.onclick = () => list.addRow(this, true);
		this.addRowAboveButton.ondragstart = (event) => event.preventDefault();
		this.dragContainer.className = "tabButton drag-container";
		this.dragHandle.className = "dragHandle";
		this.dragHandle.src = dragHandleIcon;
		this.dragHandle.draggable = false;
		this.dragHandle.ondragstart = (event) => event.preventDefault();
		this.dragContainer.append(this.dragHandle);
		this.addRowBelowButton.className = "tabButton addRowBelowButton";
		this.addRowBelowButton.src = addRowBelowIcon;
		this.addRowBelowButton.onclick = () => list.addRow(this, false);
		this.addRowBelowButton.ondragstart = (event) => event.preventDefault();
		this.rowTab.append(this.addRowAboveButton, this.dragContainer, this.addRowBelowButton);
		this.rowTitle.className = "rowTitle";
		this.rowTitle.placeholder = rowNumber ? "Row " + rowNumber : "New Row";
		this.rowTitle.ondrop = (event) => list.draggedOverTextbox(event);
		this.rowOptions.className = "resetDeleteContainer";
		this.clearButton.className = "resetButton resetDeleteButton";
		this.clearButton.style.backgroundImage = `url("${rowClearIcon}")`; // Set background image for clear button
		this.clearButton.onclick = () => list.clearRow(this);
		this.deleteButton.className = "deleteButton resetDeleteButton";
		this.deleteButton.style.backgroundImage = `url("${rowDeleteIcon}")`; // Set background image for delete button
		this.deleteButton.onclick = () => list.deleteRow(this);
		this.rowOptions.append(this.clearButton, this.deleteButton);
		this.rowOptions.onclick = (event) => event.stopPropagation();
		this.rowHeader.append(this.rowTab, this.rowTitle, this.rowOptions);
		this.rowBody.className = "rowBody image-container";
		this.rowBody.ondragover = (event) => list.draggedImageOverElement(event);
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
