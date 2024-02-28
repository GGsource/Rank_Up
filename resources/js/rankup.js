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
        rowTitle.ondrop = (event) => dropToHeader(event);
        rowTitle.onfocus = () => clearSelections();
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
        rowBody.onclick = (event) => clickContainer(event);
        rowBody.ondragover = (event) => dragImageOver(event);
        rowBody.ondragend = (event) => dragImageEnd(event);
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

var draggingImageDiv = null;
var emptyImg = new Image();
emptyImg.src = "/resources/images/empty.png";
// DragStart - Mouse is now being held on an image; it is being dragged.
function dragStart(ev) {
    document.body.classList.remove("allow-hover");
    var image = ev.target;
    if (!selectedImages.has(image)) clickImage(ev);
    selectedImages.forEach((selectedImage) => {
        selectedImage.setAttribute("data-dragging", "true");
        selectedImage.classList.add("draggingImage");
    });
    // At this point selectedImages contains all the items we want to drag. Show the user how many items theyre dragging
    // TODO: Convert this styling to a css class styling
    // TODO: Center properly on cursor
    // TODO: Center number & make more visually appealing
    draggingImageDiv = document.createElement("div");
    draggingImageDiv.style.position = "absolute";
    draggingImageDiv.style.zIndex = 1000; //Arbitrarily high, above anything else.
    draggingImageDiv.style.width = image.width + "px";
    draggingImageDiv.style.height = image.height + "px";
    draggingImageDiv.style.backgroundColor = "#f0f0f055";
    draggingImageDiv.style.border = "1px solid #000";
    draggingImageDiv.style.borderRadius = "10%";
    draggingImageDiv.style.textAlign = "center";
    draggingImageDiv.style.font = "2em 'Alice', sans-serif";
    draggingImageDiv.textContent = selectedImages.size;
    document.body.appendChild(draggingImageDiv);
    // Update the div position
    updateDragDivPosition(ev);
    // Disable the default dragging image
    ev.dataTransfer.setDragImage(emptyImg, 0, 0);
}

// DragImage - Mouse is being held and dragged.
function dragImage(ev) {
    if (draggingImageDiv) updateDragDivPosition(ev);
}

var prevTarget = null;
var prevSideLeft = null;
// DragImageOver - Mouse is being held and dragged over some target. That target receives this event.
function dragImageOver(ev) {
    // TODO: Reintroduce check to make sure item being dragged in is an image
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
        });
        prevSideLeft = curSideLeft;
    }
    // TODO: A new image has been dropped into a container. Check if it needs to be made larger to accomodate.
    prevTarget = ev.target;
}

// DragImageEnd - Mouse dragging ends. The element that the dragging ended on receives this event.
function dragImageEnd(ev) {
    document.body.classList.add("allow-hover");
    var sources = document.querySelectorAll("[data-dragging]");
    sources.forEach((source) => {
        source.classList.remove("draggingImage");
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
        deleteButton.style.opacity = 0.2;
    }
}

// AddRow - Adds a new row above or below the specified row.
function addRow(row, isAbove) {
    // First check if there is only one row remaining, if so, enable the delete button and make it look enabled.
    var rowList = document.getElementById("rowList");
    if (rowList.childElementCount == 1) {
        var deleteButton = rowList.getElementsByClassName("deleteButton")[0];
        deleteButton.style.pointerEvents = "auto";
        deleteButton.style.opacity = 1;
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
    var delayMS = useDelay ? 500 : 0;
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
    image.classList.add("selectedImage");
}

function deselectImage(image) {
    // Unselects an image
    selectedImages.delete(image);
    image.classList.remove("selectedImage");
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

// DropToHeader - drop function for dragging something onto a row header. Only allow text.
function dropToHeader(ev) {
    if (
        ev.dataTransfer.types.length != 1 ||
        ev.dataTransfer.types[0] != "text/plain"
    )
        ev.preventDefault();
}

// TODO: Make README.md for github page
// TODO: Setup this on its own webpage
// FIXME: Adding more items than row length causes overflow
// FIXME: Dragging image to header still shows symbol implying ability to drop in
// FIXME: Dragging shows icon for not allowed for a split second when going across border of an image
// IDEA: Make it so 'highlighting' multiple images by dragging across them (where browser highlights them in blue) actually selects them
// IDEA: Animate Row being removed or being added (setting height to 0 or full)
// FIXME: selection should also clear when clicking outside of the rows/container.
// IDEA: Animate reset button rotating when clicked
// TODO: Separate Row Class to separate file & perhaps other things.
// FIXME: Tabs don't linger long enough.
// TODO: Disable tabs ability to hide if it is currently being dragged.
// TODO: Make row title text shrink to fit in its container
// FIXME: Make it so you can click on the textbox by clicking between the reset and delete buttons. the empty spacer
// FIXME: Delete/Reset buttons are currently draggable but shouldn't be.
// TODO: Improve the multi-drag placeholder. Consider putting back ghost for single-drag placeholder.
// Function to make the rows on the main page
function populateInitialRows(rowCount) {
    var rowList = document.getElementById("rowList");
    for (i = 0; i < rowCount; i++) new Row().appendTo(rowList);
}
// Function to add in the placeholder images for debugging
function populatePlaceholderImages() {
    var imageNames = [
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
    var imageContainer = document.getElementById("imageContainer");
    imageNames.forEach((name, ndx) => {
        var image = document.createElement("img");
        image.id = "img" + (ndx + 1);
        image.className = "rankingImage";
        image.src = "/resources/images/" + name + ".png";
        image.onclick = (event) => clickImage(event);
        image.ondragstart = (event) => dragStart(event);
        image.ondrag = (event) => dragImage(event);
        imageContainer.appendChild(image);
    });
}

function main() {
    populateInitialRows(5); // Make the original starting rows
    populatePlaceholderImages(); //Put in the placeholders
}
main();
