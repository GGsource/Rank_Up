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
        let addRowAboveButton = document.createElement("div");
        addRowAboveButton.className = "addRowButton tabButton";
        addRowAboveButton.style.backgroundImage = "url('/resources/images/addRowAboveIcon.png')";
        addRowAboveButton.style.backgroundSize = "contain";
        let dragHandle = document.createElement("div");
        dragHandle.className = "dragHandle tabButton";
        dragHandle.style.backgroundImage = "url('/resources/images/DragHandleIcon.png')";
        dragHandle.style.backgroundSize = "contain"; // set image to fit the button
        dragHandle.style.backgroundRepeat = "no-repeat"; // don't repeat the image
        dragHandle.style.backgroundPosition = "center"; // center it
        let addRowBelowButton = document.createElement("div");
        addRowBelowButton.className = "addRowButton tabButton";
        addRowBelowButton.style.backgroundImage = "url('/resources/images/addRowBelowIcon.png')";
        addRowBelowButton.style.backgroundSize = "contain";
        // Set the row adding buttons to the proper height
        inflateAddRowButtons(addRowAboveButton, addRowBelowButton)
        // Add the buttons to the rowTab
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
        resetButton.style.backgroundImage = "url('/resources/images/rowHeaderClear.png')"; // Set background image for delete button
        resetButton.style.backgroundSize = "contain"; // set image to fit the button
        let emptyDiv = document.createElement("div");
        emptyDiv.className = "resetDeleteButton";
        let deleteButton = document.createElement("div");
        deleteButton.className = "deleteButton resetDeleteButton";
        deleteButton.id = "deleteButton" + id;
        deleteButton.style.backgroundImage = "url('/resources/images/rowHeaderDelete.png')"; // Set background image for delete button
        deleteButton.style.backgroundSize = "contain"; // set image to fit the button
        deleteButton.onclick = () => deleteRow(rowFull);
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
        rowBody.className = "rowBody rowPiece Container";
        rowBody.id = "rowBody" + id;
        rowBody.ondrop = (event) => dropImageIn(event);
        rowBody.ondragover = (event) => dragImageOver(event);
        rowBody.ondragend = (event) => dragEnd(event);
        // Add the rowBody to the mainRow
        rowFull.appendChild(rowBody);
        // Add the full row to the rowContainer
        let rowContainer = document.getElementById("rowList");
        rowContainer.appendChild(rowFull);
    }
}

// Create the initial rows
startingRowCount = 5;
for (i = 0; i < startingRowCount; i++) {
    new rowFull(i);
}

// 
function dragImageOver(ev) {
    let source = document.querySelector("[data-dragging]");
    if (source == null) {
        return;
    }
    ev.preventDefault();
}

function dragStart(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    ev.target.setAttribute("data-dragging", "true");
}

function dropImageIn(ev) {
    sourceId = ev.dataTransfer.getData("text");
    source = document.getElementById(sourceId);
    if (source == null) {
        console.log("Dropped in something that isn't an image! Blegh!") //DEBUGGING: This should never happen, but if it does, we should know about it.
        return;
    }
    ev.preventDefault();
    if (ev.target.classList.contains("Container")) {
        ev.target.appendChild(source);
    } else if (ev.target.classList.contains("rankingImage")) {
        // The user dragged an image onto another image, place the image next to the target image in its parent.
        // Check if the image was dragged to the left or right of the target image
        let targetImageRect = ev.target.getBoundingClientRect();
        let targetImageCenter = targetImageRect.left + (targetImageRect.width / 2);
        // If the user dragged the image to the left of the target image, insert the image before the target image
        if (ev.clientX < targetImageCenter) {
            ev.target.insertAdjacentElement("beforebegin", source);
        } else {
            ev.target.insertAdjacentElement("afterend", source);
        }
    }
}

function dragEnd(ev) {
    ev.target.removeAttribute("data-dragging");
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

function inflateAddRowButtons(topButton, btmButton) {
    let btnImage = new Image();
    btnImage.src = "/resources/images/addRowAboveIcon.png";
    btnImage.onload = () => {
        // Calculate the aspect ratio
        let aspectRatio = btnImage.width / btnImage.height;
        // Set the padding bottom of the top button to the aspect ratio
        let paddingBottom = (1 / aspectRatio) * 100;
        topButton.style.paddingBottom = paddingBottom + "%";
        btmButton.style.paddingBottom = paddingBottom + "%";
    }
}

// DONE: Make Reset & Delete no longer selectable or draggable.
// DONE: Make the image part of draghandle and addRowAbove/Below not selectable or draggable.
// DONE: DISALLOW users from dragging anything that isn't an image into the rowBody. Show the little X icon when they try to drag something that isn't an image into the rowBody.
// TODO: Make multiple images selectable at once to drag at the same time.
// TODO: Make image preview snap to column when image is dragged over it but not yet dropped.