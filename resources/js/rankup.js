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
        addRowAboveButton.style.backgroundImage =
            "url('/resources/images/addRowAboveIcon.png')";
        addRowAboveButton.style.backgroundRepeat = "no-repeat";
        addRowAboveButton.style.backgroundPosition = "center";
        addRowAboveButton.style.backgroundSize = "contain";
        addRowAboveButton.onclick = () => addRow(this.rowFull, true);
        var dragHandle = document.createElement("div");
        dragHandle.className = "dragHandle tabButton";
        dragHandle.style.backgroundImage =
            "url('/resources/images/DragHandleIcon.png')";
        dragHandle.style.backgroundSize = "contain"; // set image to fit the button
        dragHandle.style.backgroundRepeat = "no-repeat"; // don't repeat the image
        dragHandle.style.backgroundPosition = "center"; // center it
        var addRowBelowButton = document.createElement("div");
        addRowBelowButton.className = "addRowButton tabButton";
        addRowBelowButton.style.backgroundImage =
            "url('/resources/images/addRowBelowIcon.png')";
        addRowBelowButton.style.backgroundRepeat = "no-repeat";
        addRowBelowButton.style.backgroundPosition = "center";
        addRowBelowButton.style.backgroundSize = "contain";
        addRowBelowButton.onclick = () => addRow(this.rowFull, false);
        // Set the row adding buttons to the proper height
        inflateAddRowButtons(addRowAboveButton, addRowBelowButton);
        // Add the buttons to the rowTab
        rowTab.appendChild(addRowAboveButton);
        rowTab.appendChild(dragHandle);
        rowTab.appendChild(addRowBelowButton);
        // Add the title to the rowHeader
        var rowTitle = document.createElement("input");
        rowTitle.className = "rowTitle";
        rowTitle.id = "rowTitle" + Row.count;
        rowTitle.placeholder = isNewRow ? "New Row" : "Row " + Row.count;
        // Add a vertical div containing the reset button, an empty div, and the delete button to the rowHeader
        var resetDeleteContainer = document.createElement("div");
        resetDeleteContainer.className = "resetDeleteContainer";
        resetDeleteContainer.id = "resetDeleteContainer" + Row.count;
        var resetButton = document.createElement("div");
        resetButton.className = "resetButton resetDeleteButton";
        resetButton.id = "resetButton" + Row.count;
        resetButton.style.backgroundImage =
            "url('/resources/images/rowHeaderClear.png')"; // Set background image for delete button
        resetButton.style.backgroundSize = "contain"; // set image to fit the button
        resetButton.onclick = () => resetRow(this.rowBody);
        var emptyDiv = document.createElement("div");
        emptyDiv.className = "resetDeleteButton";
        var deleteButton = document.createElement("div");
        deleteButton.className = "deleteButton resetDeleteButton";
        deleteButton.id = "deleteButton" + Row.count;
        deleteButton.style.backgroundImage =
            "url('/resources/images/rowHeaderDelete.png')"; // Set background image for delete button
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
        rowBody.ondragover = (event) => dragImageOver(event);
        rowBody.ondragend = (event) => dragEnd(event); //TESTME: Should RowBody have this?
        rowBody.onclick = (event) => clickContainer(event);
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

var draggingImageDiv = null;
// DragStart - Mouse is now being held on an image; it is being dragged.
function dragStart(ev) {
    // ev.preventDefault();
    var image = ev.target;
    if (selectedImages.has(image)) {
        //TODO: pick up all selected image
        selectedImages.forEach((selectedImage) =>
            selectedImage.setAttribute("data-dragging", "true")
        );
    } else {
        //TODO: Pick up only current image
        clickImage(ev);
        image.setAttribute("data-dragging", "true");
    }
    // At this point selectedImages contains all the items we want to drag. Show the user how many items theyre dragging
    // TODO: Convert this styling to a css class styling
    draggingImageDiv = document.createElement("div");
    draggingImageDiv.style.position = "absolute";
    draggingImageDiv.style.zIndex = 1000; //Arbitrarily high, above anything else.
    draggingImageDiv.style.padding = "10px";
    draggingImageDiv.style.backgroundColor = "#f0f0f0";
    draggingImageDiv.style.border = "1px solid #000";
    draggingImageDiv.style.borderRadius = "10%";
    draggingImageDiv.style.textAlign = "center";
    draggingImageDiv.style.lineHeight = "30px";
    draggingImageDiv.textContent = selectedImages.size;
    document.body.appendChild(draggingImageDiv);
    // Update the div position
    updateDragDivPosition(ev);
}

// DragImage - Mouse is being held and dragged.
function dragImage(ev) {
    if (draggingImageDiv) updateDragDivPosition(ev);
}

var prevTarget = null;
var prevSideLeft = null;
// DragImageOver - Mouse is being held and dragged over something
function dragImageOver(ev) {
    // FIXME: These calculations are being done over and over hundreds of times. Make it only happen again if necessary.
    // For change to be necessary one of these must have changed: target changed, targetside changed.
    ev.preventDefault();
    var sources = document.querySelectorAll("[data-dragging]");
    if (ev.target.classList.contains("Container")) {
        sources.forEach((source) => {
            if (prevTarget == ev.target && source.nextElementSibling == null)
                return; //Same container & position, nothin should change.
            ev.target.appendChild(source);
        });
    } else if (ev.target.classList.contains("rankingImage")) {
        // The user dragged an image onto another image, place the image next to the target image in its parent.
        if (selectedImages.has(ev.target)) return; //Selected imgs need to ignore eachother
        // Check if the image was dragged to the left or right of the target image
        var targetImageRect = ev.target.getBoundingClientRect();
        var targetImageCenter =
            targetImageRect.left + targetImageRect.width / 2;
        // If the user dragged the image to the left of the target image, insert the image before the target image
        if (ev.clientX < targetImageCenter) {
            curSideLeft = true;
        } else {
            curSideLeft = false;
        }
        if (prevTarget == ev.target && curSideLeft == prevSideLeft) return;
        sources.forEach((source) => {
            if (curSideLeft)
                ev.target.insertAdjacentElement("beforebegin", source);
            else recursiveInsert(ev.target);
            source.style.opacity = 0.2;
        });
        prevSideLeft = curSideLeft;
    }
    // TODO: A new image has been dropped into a container. Check if it needs to be made larger to accomodate.
    prevTarget = ev.target;
}

// DragEnd - Mouse is released.
function dragEnd(ev) {
    var sources = document.querySelectorAll("[data-dragging]");
    sources.forEach((source) => {
        source.style.opacity = 1.0;
        source.removeAttribute("data-dragging");
    });
    draggingImageDiv.remove();
}

// UpdateDragDivPosition - updates where the div should be as mouse moves
function updateDragDivPosition(ev) {
    draggingImageDiv.style.left = ev.pageX + "px";
    draggingImageDiv.style.top = ev.pageY + "px";
}

// RecursiveInsert - Recursively places images one after the other. Required to avoid looping behavior
function recursiveInsert(image) {
    iterator = selectedImages.values();
    _recursiveInsert(image, iterator);
}
function _recursiveInsert(image, iterator) {
    var nextImg = iterator.next();
    if (!nextImg.done) {
        image.insertAdjacentElement("afterend", nextImg.value);
        _recursiveInsert(nextImg.value, iterator);
    }
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
    else row.insertAdjacentElement("afterend", new Row(true).rowFull);
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
    };
}

timeoutIds = {};
lastHiddenTab = null;

function showTab(tab) {
    if (lastHiddenTab != null && lastHiddenTab != tab)
        hideTab(lastHiddenTab, false);
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

var selectedImages = new Set();
var lastSelectedImage = null;

window.addEventListener("keydown", function (ev) {
    if (ev.key == "Control" || ev.key == "Shift") ev.preventDefault();
});

function clickImage(ev) {
    var image = ev.target;
    var container = ev.target.parentNode;
    var images = Array.from(container.children);
    var index = images.indexOf(image);

    if (ev.ctrlKey)
        // Ctrl key + click to toggle selected status on an image
        toggleSelection(image);
    else if (ev.shiftKey && lastSelectedImage != null) {
        // Shift key + click selects all images between last and current image
        var lastIndex = images.indexOf(lastSelectedImage);
        if (lastIndex !== -1) {
            var start = Math.min(index, lastIndex);
            var end = Math.max(index, lastIndex);
            for (var i = start; i <= end; i++) selectImage(images[i]);
        } else selectImage(image);
    } else {
        clearSelections();
        selectImage(image);
    }
    lastSelectedImage = image;
}

function selectImage(image) {
    // Selects an image
    selectedImages.add(image);
    image.style.border = "solid 5px #2789f1";
    image.style.borderRadius = "5px";
    image.style.backgroundColor = "#2789f163";
}

function deselectImage(image) {
    // Unselects an image
    selectedImages.delete(image);
    image.style.border = "none";
    image.style.borderRadius = "0px";
    image.style.backgroundColor = "transparent";
}

function toggleSelection(image) {
    // Flips selected status on a given image
    if (selectedImages.has(image)) deselectImage(image);
    else selectImage(image);
}

function clearSelections() {
    // Clears the list of currently selected images
    selectedImages.forEach(deselectImage);
    selectedImages.clear();
}

function clickContainer(ev) {
    // Clears selection when clicking on an empty spot of the container
    if (ev.target.classList.contains("Container")) clearSelections();
}

// DONE: Make Reset & Delete no longer selectable or draggable.
// DONE: Make the image part of draghandle and addRowAbove/Below not selectable or draggable.
// DONE: DISALLOW users from dragging anything that isn't an image into the rowBody. Show the little X icon when they try to drag something that isn't an image into the rowBody.
// DONE: If there is only one row remaining disable the delete button and make it look disabled.
// DONE: Animate tab showing up and disappearing
// DONE: Make the tab linger for a second or two after the mouse leaves it before disappearing
// DONE: Make image preview snap to column when image is dragged over it but not yet dropped.
// DONE: Make visuals for selecting images
// IDEA: Make multiple images selectable at once to drag at the same time.
// IDEA: Make buttons brighten up slightly when hovered over // Look into doing this programmatically without new images
// IDEA: Make buttons brighten up even more when clicked
// TODO: Make README.md for github page
// TODO: Setup this on its own webpage
// TODO: Make the rows themselves draggable with the drag handle
// FIXME: Adding more items than row length causes overflow
// FIXME: Images can be dragged into row title
// TODO: lightly highlight image when hovering over it
