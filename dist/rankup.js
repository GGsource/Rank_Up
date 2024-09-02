"use strict";
class Row {
    constructor(isNewRow = false) {
        this.rowFull = document.createElement("div");
        this.rowBody = document.createElement("div");
        // RowFull is the main container for the row. It contains the rowHeader and the rowBody.
        this.rowFull.className = "rowFull";
        // rowHeader consists of the title on the left, and the delete and reset buttons on the right side corners. The reset button is in the top right corner, and the delete button is in the bottom right corner. This can be done with a flexbox and an empty between the two buttons vertically.
        let rowHeader = document.createElement("div");
        rowHeader.className = "rowHeader rowPiece";
        // rowTab consists of an addRowAbove button, an addRowBelow button, and a drag handle in between, stacked vertically.
        let rowTab = document.createElement("div");
        rowTab.className = "rowTab rowPiece closed";
        rowTab.id = "rowTab" + Row.count;
        rowHeader.onmouseover = () => showTab(rowTab); // show the rowTab
        rowHeader.onmouseout = () => hideTab(rowTab); // hide the rowTab
        // Add the addRowAbove button, the addRowBelow button, and the drag handle to the rowTab
        let addRowAboveButton = document.createElement("img");
        addRowAboveButton.className = "tabButton addRowButton addRowAboveButton";
        addRowAboveButton.src = "/public/images/addRowAboveIcon.png";
        addRowAboveButton.onclick = () => addRow(this.rowFull, true);
        addRowAboveButton.ondragstart = (event) => event.preventDefault();
        let dragContainer = document.createElement("div");
        dragContainer.className = "tabButton dragContainer";
        let dragHandle = document.createElement("img");
        dragHandle.className = "dragHandle";
        dragHandle.src = "/public/images/DragHandleIcon.png";
        dragContainer.appendChild(dragHandle);
        let addRowBelowButton = document.createElement("img");
        addRowBelowButton.className = "tabButton addRowButton addRowBelowButton";
        addRowBelowButton.src = "/public/images/addRowBelowIcon.png";
        addRowBelowButton.onclick = () => addRow(this.rowFull, false);
        addRowBelowButton.ondragstart = (event) => event.preventDefault();
        // Add the buttons to the rowTab
        rowTab.appendChild(addRowAboveButton);
        rowTab.appendChild(dragContainer);
        rowTab.appendChild(addRowBelowButton);
        // Add the title to the rowHeader
        let rowTitle = document.createElement("input");
        rowTitle.className = "rowTitle";
        rowTitle.placeholder = isNewRow ? "New Row" : "Row " + Row.count;
        rowTitle.ondrop = (event) => dropToHeader(event);
        rowTitle.onfocus = () => clearSelections();
        // Add a vertical div containing the reset button, an empty div, and the delete button to the rowHeader
        let resetDeleteContainer = document.createElement("div");
        resetDeleteContainer.className = "resetDeleteContainer";
        let resetButton = document.createElement("div");
        resetButton.className = "resetButton resetDeleteButton";
        resetButton.style.backgroundImage = "url('/public/images/RowHeaderClear.png')"; // Set background image for delete button
        resetButton.onclick = () => resetRow(this.rowBody);
        let deleteButton = document.createElement("div");
        deleteButton.className = "deleteButton resetDeleteButton";
        deleteButton.style.backgroundImage = "url('/public/images/RowHeaderDelete.png')"; // Set background image for delete button
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
        this.rowBody.className = "rowBody rowPiece Container";
        this.rowBody.onclick = (event) => clickContainer(event);
        this.rowBody.ondragover = (event) => dragImageOver(event);
        this.rowBody.ondragend = (event) => dragImageEnd(event);
        resetButton.onclick = () => resetRow(this.rowBody);
        // Add the rowBody to the Row
        this.rowFull.appendChild(this.rowBody);
        Row.count++;
    }
    // Function for appending this row to a parent element
    appendTo(parent) {
        parent.appendChild(this.rowFull);
    }
}
Row.count = 1; // Keep track of number of rows created
// TODO: Rename functions to be Capitalized, as function names should be.
let draggingImageDiv;
let emptyImg = new Image();
emptyImg.src = "/public/images/empty.png";
let selectedImages = new Set();
let lastSelectedImage;
// DragStart - Mouse is now being held on an image; it is being dragged.
function dragStart(ev) {
    document.body.classList.remove("allow-hover");
    let image = ev.target;
    if (image) {
        if (!selectedImages.has(image))
            clickImage(ev);
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
        }
        else {
            console.error("ev.dataTransfer is null in DragStart");
        }
    }
    else {
        console.error("Tried to drag image but it's null in DragStart");
    }
}
// DragImage - Mouse is being held and dragged.
function dragImage(ev) {
    if (draggingImageDiv) {
        updateDragDivPosition(ev);
    }
}
let prevTarget;
let isPrevSideLeft;
// DragImageOver - Mouse is being held and dragged over some target. That target receives this event.
function dragImageOver(ev) {
    // TODO: Reintroduce check to make sure item being dragged in is an image
    // For change to be necessary one of these must have changed: target changed, targetside changed.
    ev.preventDefault();
    let sources = document.querySelectorAll("[data-dragging]");
    let element = ev.target;
    if (element) {
        if (element.classList.contains("Container")) {
            sources.forEach((source) => {
                if (prevTarget == element && source.nextElementSibling == null)
                    return; //Same container & position, nothin should change.
                element.appendChild(source);
            });
        }
        else if (element.classList.contains("rankingImage")) {
            let imageElement = element;
            // The user dragged an image onto another image, place the image next to the target image in its parent.
            if (selectedImages.has(imageElement))
                return; //Selected imgs need to ignore eachother
            // Check if the image was dragged to the left or right of the target image
            let targetImageRect = imageElement.getBoundingClientRect();
            let targetImageCenter = targetImageRect.left + targetImageRect.width / 2;
            // If the user dragged the image to the left of the target image, insert the image before the target image
            let isCurSideLeft = ev.clientX < targetImageCenter ? true : false;
            if (prevTarget == element && isCurSideLeft == isPrevSideLeft)
                return;
            sources.forEach((source) => {
                if (isCurSideLeft)
                    imageElement.insertAdjacentElement("beforebegin", source);
                else
                    recursiveInsert(imageElement);
            });
            isPrevSideLeft = isCurSideLeft;
        }
        // TODO: A new image has been dropped into a container. Check if the container needs to be made larger to accomodate.
        prevTarget = element;
    }
    else {
        console.error("ev.target is is null in DragImageOver");
    }
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
    draggingImageDiv.style.left = `${ev.pageX}px`;
    draggingImageDiv.style.top = `${ev.pageY}px`;
}
// RecursiveInsert - Recursively places images one after the other. Required to avoid looping behavior
function recursiveInsert(image) {
    let iterator = selectedImages.values();
    _recursiveInsert(image, iterator);
}
function _recursiveInsert(image, iterator) {
    let nextImg = iterator.next();
    if (!nextImg.done) {
        image.insertAdjacentElement("afterend", nextImg.value);
        _recursiveInsert(nextImg.value, iterator);
    }
}
// ResetRow - Resets a specified row to be empty, moving children back to imageContanier.
function resetRow(rowBody) {
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
        }
        else {
            console.error("Tried to get imageCountainer while resetting a row but it's null.");
        }
    }
}
// DeleteRow - Deletes a specified row and moves any contents to the imageContainer at the bottom of the page.
function deleteRow(row) {
    // First check if this row had any images in it, if so, move them to the imageContainer
    let rowBody = row.getElementsByClassName("rowBody")[0];
    resetRow(rowBody);
    // Remove the row from the rowList
    row.remove();
    // If there is only one row remaining disable the delete button and make it look disabled.
    let rowList = document.getElementById("rowList");
    if (rowList && rowList.childElementCount == 1) {
        let deleteButton = rowList.getElementsByClassName("deleteButton")[0];
        deleteButton.style.pointerEvents = "none";
        deleteButton.style.opacity = `${0.2}`;
    }
}
// AddRow - Adds a new row above or below the specified row.
function addRow(row, isAbove) {
    // First check if there is only one row remaining, if so, enable the delete button and make it look enabled.
    var rowList = document.getElementById("rowList");
    if (rowList && rowList.childElementCount == 1) {
        let deleteButton = rowList.getElementsByClassName("deleteButton")[0];
        deleteButton.style.pointerEvents = "auto";
        deleteButton.style.opacity = `${1}`;
    }
    // Create the new row
    if (isAbove)
        row.insertAdjacentElement("beforebegin", new Row(true).rowFull);
    else
        row.insertAdjacentElement("afterend", new Row(true).rowFull);
}
let timeoutIds = {};
let lastHiddenTab;
function showTab(tab) {
    if (lastHiddenTab && lastHiddenTab != tab) {
        hideTab(lastHiddenTab, false);
    }
    clearTimeout(timeoutIds[tab.id]);
    tab.classList.remove("closed");
    lastHiddenTab = tab;
}
function hideTab(tab, useDelay = true) {
    if (isRowBeingDragged)
        return;
    if (timeoutIds[tab.id])
        clearTimeout(timeoutIds[tab.id]); // Clear any existing timeout
    let delayMS = useDelay ? 500 : 0; // If delay is enabled, then we'll do half a second
    timeoutIds[tab.id] = setTimeout(() => {
        tab.classList.add("closed");
    }, delayMS);
}
window.addEventListener("keydown", function (ev) {
    if (ev.key == "Control" || ev.key == "Shift") {
        ev.preventDefault();
    }
});
function clickImage(ev) {
    let image = ev.target;
    if (image) {
        let container = image.parentNode;
        let images = Array.from(container.children);
        let index = images.indexOf(image);
        if (ev.ctrlKey)
            // Ctrl key + click to toggle selected status on an image
            toggleSelection(image);
        else if (ev.shiftKey && lastSelectedImage) {
            // Shift key + click selects all images between last and current image
            let lastIndex = images.indexOf(lastSelectedImage);
            if (lastIndex !== -1) {
                let start = Math.min(index, lastIndex);
                let end = Math.max(index, lastIndex);
                for (let i = start; i <= end; i++) {
                    selectImage(images[i]);
                }
            }
            else {
                selectImage(image);
            }
        }
        else {
            // Normal image click, only select the one image
            clearSelections();
            selectImage(image);
        }
        lastSelectedImage = image;
    }
    else {
        console.log("Image was clicked but returned null.");
    }
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
    if (selectedImages.has(image))
        deselectImage(image);
    else
        selectImage(image);
}
function clearSelections() {
    // Clears the list of currently selected images
    selectedImages.forEach(deselectImage);
    selectedImages.clear(); //TESTME: This line might be redundant. And if it is, is the function redundant?
}
function clickContainer(ev) {
    // Clears selection when clicking on an empty spot of the container
    let container = ev.target;
    if (container && container.classList.contains("Container"))
        clearSelections();
}
// DropToHeader - drop function for dragging something onto a row header. Only allow text.
function dropToHeader(ev) {
    let data = ev.dataTransfer;
    if (data && (data.types.length != 1 || data.types[0] != "text/plain"))
        ev.preventDefault();
}
// TODO: Make README.md for github page
// TODO: Add new build instructions with typescript, mostly for myself
// FIXME: Adding more items than row length causes overflow
// FIXME: Dragging image to header still shows symbol implying ability to drop in
// FIXME: Dragging shows icon for not allowed for a split second when going across border of an image
// IDEA: Make it so 'highlighting' multiple images by dragging across them (where browser highlights them in blue) actually selects them
// IDEA: Animate Row being removed or being added (setting height to 0 or full)
// FIXME: selection should also clear when clicking outside of the rows/container.
// TODO: Separate Row Class to separate file & perhaps other things.
// TODO: Make row title text shrink to fit in its container
// TODO: Improve the multi-drag placeholder. Consider putting back ghost for single-drag placeholder.
// FIXME: Dragging image offscreen makes the square be placed outside the list
// Function to make the rows on the main page
function populateInitialRows(rowCount) {
    let rowList = document.getElementById("rowList");
    if (rowList)
        for (let i = 0; i < rowCount; i++)
            new Row().appendTo(rowList);
}
// Function to add in the placeholder images for debugging
function populatePlaceholderImages() {
    let imageNames = [
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
    let imageContainer = document.getElementById("imageContainer");
    if (imageContainer) {
        imageNames.forEach((name) => {
            let image = document.createElement("img");
            image.className = "rankingImage";
            image.src = "/public/images/" + name + ".png";
            image.onclick = (event) => clickImage(event);
            image.ondragstart = (event) => dragStart(event);
            image.ondrag = (event) => dragImage(event);
            imageContainer.appendChild(image);
        });
    }
    else {
        console.error("Couldn't populate container with placeholders because imageContainer was not null.");
    }
}
let isRowBeingDragged = false;
// Function to add drag ability with JQuery
function makeRowsDrag() {
    $("#rowList").sortable({
        handle: ".dragContainer", // Specify the tab as the handle for dragging
        axis: "y", // Allow vertical reordering
        start: function (event, ui) {
            isRowBeingDragged = true;
        },
        stop: function (event, ui) {
            isRowBeingDragged = false;
            hideTab(ui.item[0].getElementsByClassName("rowTab")[0]);
        },
    });
}
function main() {
    populateInitialRows(5); // Make the original starting rows
    makeRowsDrag();
    populatePlaceholderImages(); //Put in the placeholders
}
main();
// TODO: Enable extra tsconfig settings. https://youtu.be/d56mG7DezGs?t=2601
// TODO: Add return types to all functions
