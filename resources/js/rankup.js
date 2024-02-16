class Row {
    static count = 1; // Keep track of number of rows created
    constructor(isNewRow = false) {
        // RowFull is the main container for the row. It contains the rowHeader and the rowBody.
        this.rowFull = document.createElement("div");
        this.rowFull.className = "rowFull";
        this.rowFull.id = "rowFull" + Row.count;
        // DONE: rowHeader will be the element that contains the row's title and the row's delete and reset buttons.
        // rowHeader consists of the title on the left, and the delete and reset buttons on the right side corners. The reset button is in the top right corner, and the delete button is in the bottom right corner. This can be done with a flexbox and an empty between the two buttons vertically.
        var rowHeader = document.createElement("div");
        rowHeader.className = "rowHeader rowPiece";
        rowHeader.id = "rowHeader" + Row.count;
        // DONE: rowTab will be the left-most element that will be used to drag the row up and down, as well as have buttons to add a new row above or below it.
        // rowTab consists of an addRowAbove button, an addRowBelow button, and a drag handle in between, stacked vertically.
        var rowTab = document.createElement("div");
        rowTab.className = "rowTab rowPiece closed";
        rowTab.id = "rowTab" + Row.count;
        // rowTab.style.visibility = "hidden";
        rowHeader.onmouseover = () => showTab(rowTab); // show the rowTab
        rowHeader.onmouseout = () => hideTab(rowTab); // hide the rowTab
        // Add the addRowAbove button, the addRowBelow button, and the drag handle to the rowTab
        var addRowAboveButton = document.createElement("div");
        addRowAboveButton.className = "addRowButton tabButton";
        addRowAboveButton.style.backgroundImage = "url('/resources/images/addRowAboveIcon.png')";
        addRowAboveButton.style.backgroundRepeat = "no-repeat";
        addRowAboveButton.style.backgroundPosition = "center";
        addRowAboveButton.style.backgroundSize = "contain";
        addRowAboveButton.onclick = () => addRow(this.rowFull, true);
        var dragHandle = document.createElement("div");
        dragHandle.className = "dragHandle tabButton";
        dragHandle.style.backgroundImage = "url('/resources/images/DragHandleIcon.png')";
        dragHandle.style.backgroundSize = "contain"; // set image to fit the button
        dragHandle.style.backgroundRepeat = "no-repeat"; // don't repeat the image
        dragHandle.style.backgroundPosition = "center"; // center it
        var addRowBelowButton = document.createElement("div");
        addRowBelowButton.className = "addRowButton tabButton";
        addRowBelowButton.style.backgroundImage = "url('/resources/images/addRowBelowIcon.png')";
        addRowBelowButton.style.backgroundRepeat = "no-repeat";
        addRowBelowButton.style.backgroundPosition = "center";
        addRowBelowButton.style.backgroundSize = "contain";
        addRowBelowButton.onclick = () => addRow(this.rowFull, false);
        // Set the row adding buttons to the proper height
        inflateAddRowButtons(addRowAboveButton, addRowBelowButton)
        // Add the buttons to the rowTab
        rowTab.appendChild(addRowAboveButton);
        rowTab.appendChild(dragHandle);
        rowTab.appendChild(addRowBelowButton);
        // Add the title to the rowHeader
        var rowTitle = document.createElement("div");
        rowTitle.className = "rowTitle";
        rowTitle.id = "rowTitle" + Row.count;
        rowTitle.innerHTML = isNewRow ? "New Row" : "Row " + Row.count;
        rowTitle.contentEditable = true;
        // Add a vertical div containing the reset button, an empty div, and the delete button to the rowHeader
        var resetDeleteContainer = document.createElement("div");
        resetDeleteContainer.className = "resetDeleteContainer";
        resetDeleteContainer.id = "resetDeleteContainer" + Row.count;
        var resetButton = document.createElement("div");
        resetButton.className = "resetButton resetDeleteButton";
        resetButton.id = "resetButton" + Row.count;
        resetButton.style.backgroundImage = "url('/resources/images/rowHeaderClear.png')"; // Set background image for delete button
        resetButton.style.backgroundSize = "contain"; // set image to fit the button
        resetButton.onclick = () => resetRow(this.rowBody);
        var emptyDiv = document.createElement("div");
        emptyDiv.className = "resetDeleteButton";
        var deleteButton = document.createElement("div");
        deleteButton.className = "deleteButton resetDeleteButton";
        deleteButton.id = "deleteButton" + Row.count;
        deleteButton.style.backgroundImage = "url('/resources/images/rowHeaderDelete.png')"; // Set background image for delete button
        deleteButton.style.backgroundSize = "contain"; // set image to fit the button
        deleteButton.onclick = () => deleteRow(this.rowFull);
        resetDeleteContainer.appendChild(resetButton);
        resetDeleteContainer.appendChild(emptyDiv);
        resetDeleteContainer.appendChild(deleteButton);
        // Add the rowTitle and the resetDeleteContainer to the rowHeader
        rowHeader.appendChild(rowTab);
        rowHeader.appendChild(rowTitle);
        rowHeader.appendChild(resetDeleteContainer);
        // Add the rowHeader to the full row
        this.rowFull.appendChild(rowHeader);
        // DONE: rowBody will be the element that contains the row's ranking images.
        var rowBody = document.createElement("div");
        rowBody.className = "rowBody rowPiece Container";
        rowBody.id = "rowBody" + Row.count;
        rowBody.ondrop = (event) => dropImageIn(event);
        rowBody.ondragover = (event) => dragImageOver(event);
        rowBody.ondragend = (event) => dragEnd(event);
        resetButton.onclick = () => resetRow(rowBody);
        // Add the rowBody to the mainRow
        this.rowFull.appendChild(rowBody);
        Row.count++;
    }
    // Function for appending this row to a parent element
    appendTo(parent) {
        parent.appendChild(this.rowFull);
    }
}

// Create the initial rows
startingRowCount = 5;
var rowContainer = document.getElementById("rowList");
for (i = 0; i < startingRowCount; i++) {
    new Row().appendTo(rowContainer);
}

// 
function dragImageOver(ev) {
    var source = document.querySelector("[data-dragging]");
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
        var targetImageRect = ev.target.getBoundingClientRect();
        var targetImageCenter = targetImageRect.left + (targetImageRect.width / 2);
        // If the user dragged the image to the left of the target image, insert the image before the target image
        if (ev.clientX < targetImageCenter) {
            ev.target.insertAdjacentElement("beforebegin", source);
        } else {
            ev.target.insertAdjacentElement("afterend", source);
        }
    }
    source.style.opacity = 0.5;
}

function dragStart(ev) {
    // ev.dataTransfer.setData("text", ev.target.id);
    ev.target.setAttribute("data-dragging", "true");
}

function dropImageIn(ev) {
    // sourceId = ev.dataTransfer.getData("text");
    // source = document.getElementById(sourceId);
    // DELETEME: Currently Useless.
}

function dragEnd(ev) {
    var source = document.querySelector("[data-dragging]");
    source.style.opacity = 1.0;
    ev.target.removeAttribute("data-dragging");
}

// ResetRow - Resets a specified row to be empty, moving children back to imageContanier.
function resetRow(rowBody) {
    if (rowBody.hasChildNodes()) {
        var imageContainer = document.getElementById("imageContainer");
        while (rowBody.hasChildNodes()) {
            imageContainer.appendChild(rowBody.firstChild);
        }
    }
}

// DeleteRow - Deletes a specified row and moves any contents to the imageContainer at the bottom of the page.
function deleteRow(row) {
    // First check if this row had any images in it, if so, move them to the imageContainer
    rowBody = row.getElementsByClassName("rowBody")[0];
    resetRow(rowBody);
    // Remove the row from the rowList
    row.remove();

    // If there is only one row remaining disable the delete button and make it look disabled.
    var rowList = document.getElementById("rowList");
    if (rowList.childElementCount == 1) {
        var deleteButton = rowList.getElementsByClassName("deleteButton")[0];
        deleteButton.style.pointerEvents = "none";
        deleteButton.style.opacity = "0.5";
    }
}

// AddRow - Adds a new row above or below the specified row.
function addRow(row, isAbove) {
    // First check if there is only one row remaining, if so, enable the delete button and make it look enabled.
    var rowList = document.getElementById("rowList");
    if (rowList.childElementCount == 1) {
        var deleteButton = rowList.getElementsByClassName("deleteButton")[0];
        deleteButton.style.pointerEvents = "auto";
        deleteButton.style.opacity = "1";
    }
    // Create the new row
    if (isAbove)
        row.insertAdjacentElement("beforebegin", new Row(true).rowFull);
    else
        row.insertAdjacentElement("afterend", new Row(true).rowFull);
}

function inflateAddRowButtons(topButton, btmButton) {
    var btnImage = new Image();
    btnImage.src = "/resources/images/addRowAboveIcon.png";
    btnImage.onload = () => {
        // Calculate the aspect ratio
        var aspectRatio = btnImage.width / btnImage.height;
        // Set the padding bottom of the top button to the aspect ratio
        var paddingBottom = (1 / aspectRatio) * 100;
        topButton.style.paddingBottom = paddingBottom + "%";
        btmButton.style.paddingBottom = paddingBottom + "%";
    }
}

timeoutIds = {};
lastHiddenTab = null;

function showTab(tab) {
    if (lastHiddenTab != null && lastHiddenTab != tab) hideTab(lastHiddenTab, false);
    clearTimeout(timeoutIds[tab.id]);
    tab.classList.remove("closed");
    lastHiddenTab = tab;
}

function hideTab(tab, useDelay = true) {
    if (timeoutIds[tab.id]) clearTimeout(timeoutIds[tab.id]); // Clear any existing timeout
    var delayMS = useDelay ? 300 : 0;
    timeoutIds[tab.id] = setTimeout(() => {
        tab.classList.add("closed");
    }, delayMS);
}

// DONE: Make Reset & Delete no longer selectable or draggable.
// DONE: Make the image part of draghandle and addRowAbove/Below not selectable or draggable.
// DONE: DISALLOW users from dragging anything that isn't an image into the rowBody. Show the little X icon when they try to drag something that isn't an image into the rowBody.
// DONE: If there is only one row remaining disable the delete button and make it look disabled.
// DONE: Animate tab showing up and disappearing
// DONE: Make the tab linger for a second or two after the mouse leaves it before disappearing
// DONE: Make image preview snap to column when image is dragged over it but not yet dropped.
// IDEA: Make multiple images selectable at once to drag at the same time.
// IDEA: Make buttons brighten up slightly when hovered over // Look into doing this programmatically without new images
// IDEA: Make buttons brighten up even more when clicked
// TODO: Make README.md for github page
// TODO: Setup this on its own webpage
// TODO: Make the rows themselves draggable with the drag handle
// FIXME: Adding more items than row length causes overflow
// FIXME: Images can be dragged into row title