class RankRow {
    constructor(id) {
        this.element = document.createElement("div");
        this.element.id = id;
        this.element.className = "RankRow Container";
        this.element.ondrop = (event) => drop(event);
        this.element.ondragover = (event) => allowDrop(event);

        // Add this new row to the rowContainer
        const rowContainer = document.getElementById("rowList");
        rowContainer.appendChild(this.element);
    }
}

class rowFull {
    constructor(id) {
        // RowFull is the main container for the row. It contains the rowHeader and the rowBody.
        let rowFull = document.createElement("div");
        rowFull.className = "rowFull";
        rowFull.id = "rowFull" + id;
        // DONE: rowHeader will be the element that contains the row's title and the row's delete and reset buttons.
        // rowHeader consists of the title on the left, and the delete and reset buttons on the right side corners. The reset button is in the top right corner, and the delete button is in the bottom right corner. This can be done with a flexbox and an empty between the two buttons vertically.
        let rowHeader = document.createElement("div");
        rowHeader.className = "rowHeader rowPiece";
        rowHeader.id = "rowHeader" + id;
        rowHeader.onmouseover = () => showRowTab(rowHeader);
        rowHeader.onmouseout = () => hideRowTab(rowHeader);
        // DONE: rowTab will be the left-most element that will be used to drag the row up and down, as well as have buttons to add a new row above or below it.
        // rowTab consists of an addRowAbove button, an addRowBelow button, and a drag handle in between, stacked vertically.
        let rowTab = document.createElement("div");
        rowTab.className = "rowTab rowPiece";
        rowTab.id = "rowTab" + id;
        rowTab.style.visibility = "hidden";
        // Add the addRowAbove button, the addRowBelow button, and the drag handle to the rowTab
        let addRowAboveButton = document.createElement("img");
        addRowAboveButton.className = "addRowButton tabButton";
        addRowAboveButton.src = "/resources/images/addRowAboveIcon.png";
        let dragHandle = document.createElement("img");
        dragHandle.className = "dragHandle tabButton";
        dragHandle.src = "/resources/images/DragHandleIcon.png";
        let addRowBelowButton = document.createElement("img");
        addRowBelowButton.className = "addRowButton tabButton";
        addRowBelowButton.src = "/resources/images/addRowBelowIcon.png";
        rowTab.appendChild(addRowAboveButton);
        rowTab.appendChild(dragHandle);
        rowTab.appendChild(addRowBelowButton);
        // Add the title to the rowHeader
        let rowTitle = document.createElement("div");
        rowTitle.className = "rowTitle";
        rowTitle.id = "rowTitle" + id;
        rowTitle.innerHTML = "Row " + id;
        // Add a vertical div containing the reset button, an empty div, and the delete button to the rowHeader
        let resetDeleteContainer = document.createElement("div");
        resetDeleteContainer.className = "resetDeleteContainer";
        resetDeleteContainer.id = "resetDeleteContainer" + id;
        let resetButton = document.createElement("div");
        resetButton.className = "resetButton resetDeleteButton";
        resetButton.id = "resetButton" + id;
        // Add image to reset button
        let resetButtonImage = document.createElement("img");
        resetButtonImage.src = "/resources/images/RowHeaderClear.png";
        resetButtonImage.className = "resetButtonImage resetDeleteImage";
        resetButton.appendChild(resetButtonImage);
        let emptyDiv = document.createElement("div");
        emptyDiv.className = "resetDeleteButton";
        let deleteButton = document.createElement("div");
        deleteButton.className = "deleteButton resetDeleteButton";
        deleteButton.id = "deleteButton" + id;
        // Add image to delete button
        let deleteButtonImage = document.createElement("img");
        deleteButtonImage.src = "/resources/images/RowHeaderDelete.png";
        deleteButtonImage.className = "deleteButtonImage resetDeleteImage";
        deleteButtonImage.onclick = () => deleteRow(rowFull);
        deleteButton.appendChild(deleteButtonImage);
        resetDeleteContainer.appendChild(resetButton);
        resetDeleteContainer.appendChild(emptyDiv);
        resetDeleteContainer.appendChild(deleteButton);
        // Add the rowTitle and the resetDeleteContainer to the rowHeader
        rowHeader.appendChild(rowTab);
        rowHeader.appendChild(rowTitle);
        rowHeader.appendChild(resetDeleteContainer);
        // Add the rowHeader to the full row
        rowFull.appendChild(rowHeader);
        // DONE: rowBody will be the element that contains the row's ranking images.
        // rowBody is the container the user will drag the images into to rank them.
        let rowBody = document.createElement("div");
        rowBody.className = "rowBody rowPiece";
        rowBody.id = "rowBody" + id;
        rowBody.ondrop = (event) => drop(event);
        rowBody.ondragover = (event) => allowDrop(event);
        // Add the rowBody to the mainRow
        rowFull.appendChild(rowBody);
        // Add the full row to the rowContainer
        let rowContainer = document.getElementById("rowList");
        rowContainer.appendChild(rowFull);
    }
}

startingRowCount = 5;
for (i = 0; i < startingRowCount; i++) {
    new rowFull(i);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function dragStart(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    // Make the element semi transparent

}

function drop(ev) {
    ev.preventDefault();
    if (ev.target.className != "rankingImage") {
        var data = ev.dataTransfer.getData("text");
        ev.target.appendChild(document.getElementById(data));
    }
}

function showRowTab(element) {
    rowTab = element.parentElement.getElementsByClassName("rowTab")[0];
    rowTab.style.visibility = "visible";

}

function hideRowTab(element) {
    rowTab = element.parentElement.getElementsByClassName("rowTab")[0];
    rowTab.style.visibility = "hidden";
}

// DeleteRow - Deletes a specified row and moves any contents to the imageContainer at the bottom of the page.
function deleteRow(row) {
    // First check if this row had any images in it, if so, move them to the imageContainer
    let rowBody = row.getElementsByClassName("rowBody")[0];
    if (rowBody.hasChildNodes()) {
        let imageContainer = document.getElementById("imageContainer");
        while (rowBody.hasChildNodes()) {
            imageContainer.appendChild(rowBody.firstChild);
        }
    }
    row.remove();
}

// AddRow - Adds a new row above or below the specified row.
function addRow(row, above = true) {
    // TODO: Implement adding a row above or below the specified row.
}