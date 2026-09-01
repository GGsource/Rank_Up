import addRowAboveIcon from "@/assets/images/addRowAboveIcon.png";
import addRowBelowIcon from "@/assets/images/addRowBelowIcon.png";
import dragHandleIcon from "@/assets/images/DragHandleIcon.png";
import rowHeaderClearIcon from "@/assets/images/RowHeaderClear.png";
import rowHeaderDeleteIcon from "@/assets/images/RowHeaderDelete.png";

/**
 * Defines signature of abilities a list of rows must contain
 */
export interface RowList {
	showTab(tab: HTMLDivElement): void;
	hideTab(tab: HTMLDivElement, useDelay?: boolean): void;
	addRow(row: Row, isAbove: boolean): void;
	clearRow(row: Row): void;
	deleteRow(row: Row): void;
	dragImageOver(event: DragEvent): void;
	dragImageEnd(): void;
	draggedOntoTextBox(event: DragEvent): void;
}

export class Row extends HTMLElement {
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
	constructor(list: RowList, rowNumber = 0) {
		super();
		this.className = "rowFull";
		this.rowHeader.className = "rowHeader rowPiece";
		this.rowHeader.onmouseover = () => list.showTab(this.rowTab); // show the rowTab
		this.rowHeader.onmouseout = () => list.hideTab(this.rowTab); // hide the rowTab
		this.rowTab.className = "rowTab rowPiece closed";
		this.rowTab.onclick = (event) => event.stopPropagation();
		this.addRowAboveButton.className = "tabButton addRowButton addRowAboveButton";
		this.addRowAboveButton.src = addRowAboveIcon;
		this.addRowAboveButton.onclick = () => list.addRow(this, true);
		this.addRowAboveButton.ondragstart = (event) => event.preventDefault();
		this.dragContainer.className = "tabButton dragContainer";
		this.dragHandle.className = "dragHandle";
		this.dragHandle.src = dragHandleIcon;
		this.dragHandle.draggable = false;
		this.dragHandle.ondragstart = (event) => event.preventDefault();
		this.dragContainer.append(this.dragHandle);
		this.addRowBelowButton.className = "tabButton addRowButton addRowBelowButton";
		this.addRowBelowButton.src = addRowBelowIcon;
		this.addRowBelowButton.onclick = () => list.addRow(this, false);
		this.addRowBelowButton.ondragstart = (event) => event.preventDefault();
		this.rowTab.append(this.addRowAboveButton, this.dragContainer, this.addRowBelowButton);
		this.rowTitle.className = "rowTitle";
		this.rowTitle.placeholder = rowNumber ? "Row " + rowNumber : "New Row";
		this.rowTitle.ondrop = (event) => list.draggedOntoTextBox(event);
		this.statusBtnsContainer.className = "resetDeleteContainer";
		this.clearButton.className = "resetButton resetDeleteButton";
		this.clearButton.style.backgroundImage = `url("${rowHeaderClearIcon}")`; // Set background image for clear button
		this.clearButton.onclick = () => list.clearRow(this);
		this.deleteButton.className = "deleteButton resetDeleteButton";
		this.deleteButton.style.backgroundImage = `url("${rowHeaderDeleteIcon}")`; // Set background image for delete button
		this.deleteButton.onclick = () => list.deleteRow(this);
		this.statusBtnsContainer.append(this.clearButton, this.deleteButton);
		this.statusBtnsContainer.onclick = (event) => event.stopPropagation();
		this.rowHeader.append(this.rowTab, this.rowTitle, this.statusBtnsContainer);
		this.rowBody.className = "rowBody rowPiece image-container";
		this.rowBody.ondragover = (event) => list.dragImageOver(event);
		this.rowBody.ondragend = () => list.dragImageEnd();
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
