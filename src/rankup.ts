class Row {
    static count = 1; // Keep track of number of rows created
    rowFull: HTMLDivElement = document.createElement("div");
    rowBody: HTMLDivElement = document.createElement("div");
    constructor(isNewRow = false) {
        // RowFull is the main container for the row. It contains the rowHeader and the rowBody.
        this.rowFull.className = "rowFull";
        // rowHeader consists of the title on the left, and the delete and reset buttons on the right side corners. The reset button is in the top right corner, and the delete button is in the bottom right corner. This can be done with a flexbox and an empty between the two buttons vertically.
        var rowHeader = document.createElement("div");
        rowHeader.className = "rowHeader rowPiece";
        // rowTab consists of an addRowAbove button, an addRowBelow button, and a drag handle in between, stacked vertically.
        var rowTab = document.createElement("div");
        rowTab.className = "rowTab rowPiece closed";
        rowTab.id = "rowTab" + Row.count;
        rowHeader.onmouseover = () => showTab(rowTab); // show the rowTab
        rowHeader.onmouseout = () => hideTab(rowTab); // hide the rowTab
        // Add the addRowAbove button, the addRowBelow button, and the drag handle to the rowTab
        var addRowAboveButton = document.createElement("img");
        addRowAboveButton.className = "tabButton addRowButton addRowAboveButton";
        addRowAboveButton.src = "/resources/images/addRowAboveIcon.png";
        addRowAboveButton.onclick = () => addRow(this.rowFull, true);
        addRowAboveButton.ondragstart = (event) => event.preventDefault();
        var dragContainer = document.createElement("div");
        dragContainer.className = "tabButton dragContainer";
        var dragHandle = document.createElement("img");
        dragHandle.className = "dragHandle";
        dragHandle.src = "/resources/images/DragHandleIcon.png";
        dragContainer.appendChild(dragHandle);
        var addRowBelowButton = document.createElement("img");
        addRowBelowButton.className = "tabButton addRowButton addRowBelowButton";
        addRowBelowButton.src = "/resources/images/addRowBelowIcon.png";
        addRowBelowButton.onclick = () => addRow(this.rowFull, false);
        addRowBelowButton.ondragstart = (event) => event.preventDefault();
        // Add the buttons to the rowTab
        rowTab.appendChild(addRowAboveButton);
        rowTab.appendChild(dragContainer);
        rowTab.appendChild(addRowBelowButton);
        // Add the title to the rowHeader
        var rowTitle = document.createElement("input");
        rowTitle.className = "rowTitle";
        rowTitle.placeholder = isNewRow ? "New Row" : "Row " + Row.count;
        rowTitle.ondrop = (event) => dropToHeader(event);
        rowTitle.onfocus = () => clearSelections();
        // Add a vertical div containing the reset button, an empty div, and the delete button to the rowHeader
        var resetDeleteContainer = document.createElement("div");
        resetDeleteContainer.className = "resetDeleteContainer";
        var resetButton = document.createElement("div");
        resetButton.className = "resetButton resetDeleteButton";
        resetButton.style.backgroundImage = "url('/resources/images/RowHeaderClear.png')"; // Set background image for delete button
        resetButton.onclick = () => resetRow(this.rowBody);
        var deleteButton = document.createElement("div");
        deleteButton.className = "deleteButton resetDeleteButton";
        deleteButton.style.backgroundImage = "url('/resources/images/RowHeaderDelete.png')"; // Set background image for delete button
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
    appendTo(parent: HTMLElement) {
        parent.appendChild(this.rowFull);
    }
}

// TODO: Rename functions to be Capitalized, as function names should be.

let draggingImageDiv: HTMLDivElement;
let emptyImg: HTMLImageElement = new Image();
emptyImg.src = "/resources/images/empty.png";
let selectedImages: Set<HTMLImageElement> = new Set();
let lastSelectedImage: HTMLImageElement;
// DragStart - Mouse is now being held on an image; it is being dragged.
function dragStart(ev: DragEvent) {
    document.body.classList.remove("allow-hover");
    let image: HTMLImageElement = ev.target as HTMLImageElement;
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
        console.error("ev.dataTransfer is null in dragStart");
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
    // TODO: Reintroduce check to make sure item being dragged in is an image
    // For change to be necessary one of these must have changed: target changed, targetside changed.
    ev.preventDefault();
    let sources: NodeListOf<Element> = document.querySelectorAll("[data-dragging]");
    if (ev.target) {
        let element: HTMLElement = ev.target as HTMLElement;
        if (element.classList.contains("Container")) {
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
        // TODO: A new image has been dropped into a container. Check if the container needs to be made larger to accomodate.
        prevTarget = element;
    } else {
        console.error("ev.target is is null in DragImageOver");
    }
}

// DragImageEnd - Mouse dragging ends. The element that the dragging ended on receives this event.
function dragImageEnd(ev: DragEvent) {
    document.body.classList.add("allow-hover");
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
        let deleteButton: HTMLElement = rowList.getElementsByClassName("deleteButton")[0] as HTMLElement;
        deleteButton.style.pointerEvents = "none";
        deleteButton.style.opacity = `${0.2}`;
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
    if (isAbove) row.insertAdjacentElement("beforebegin", new Row(true).rowFull);
    else row.insertAdjacentElement("afterend", new Row(true).rowFull);
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
    if (isRowBeingDragged) return;
    if (timeoutIds[tab.id]) clearTimeout(timeoutIds[tab.id]); // Clear any existing timeout
    var delayMS = useDelay ? 500 : 0;
    timeoutIds[tab.id] = setTimeout(() => {
        tab.classList.add("closed");
    }, delayMS);
}

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
    if (ev.dataTransfer.types.length != 1 || ev.dataTransfer.types[0] != "text/plain") ev.preventDefault();
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
    var rowList = document.getElementById("rowList");
    for (i = 0; i < rowCount; i++) new Row().appendTo(rowList);
}
// Function to add in the placeholder images for debugging
function populatePlaceholderImages() {
    var imageNames = ["bird", "bird_evil", "BordBlue", "BordGreen", "BordPink", "BordPorple", "BordRee", "BordWhite", "BordYellow"];
    var imageContainer = document.getElementById("imageContainer");
    imageNames.forEach((name) => {
        var image = document.createElement("img");
        image.className = "rankingImage";
        image.src = "/resources/images/" + name + ".png";
        image.onclick = (event) => clickImage(event);
        image.ondragstart = (event) => dragStart(event);
        image.ondrag = (event) => dragImage(event);
        imageContainer.appendChild(image);
    });
}
var isRowBeingDragged = false;
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
