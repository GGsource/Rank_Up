const rowList = document.getElementById("rowList");

class Row {
    static count: number = 1; // Keep track of number of rows created
    rowBounds = document.createElement("div");
    rowFull: HTMLDivElement = document.createElement("div");
    rowBody: HTMLDivElement = document.createElement("div");
    constructor(isNewRow = false) {
        // rowBounds is the full rectangle containing rows, important for bounding boxes
        this.rowBounds.className = "rowBounds";
        this.rowBounds.id = "rowBounds" + Row.count;
        this.rowBounds.ondragover = (event) => OnRowDragOver(event, this.rowBounds);
        this.rowBounds.ondragend = (event) => OnRowDragEnd(event, this.rowBounds);
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
        addRowAboveButton.src = "/src/assets/images/addRowAboveIcon.png";
        addRowAboveButton.onclick = () => addRow(this.rowBounds, true);
        addRowAboveButton.ondragstart = (event) => event.preventDefault();
        let dragContainer: HTMLDivElement = document.createElement("div");
        dragContainer.className = "tabButton dragContainer";
        let dragHandle: HTMLImageElement = document.createElement("img");
        dragHandle.className = "dragHandle";
        dragHandle.src = "/src/assets/images/DragHandleIcon.png";
        dragHandle.draggable = false; // Prevent native image drag
        dragContainer.draggable = true; // Make the dragContainer draggable
        dragContainer.ondragstart = (event) => onRowDragStart(event, this.rowBounds.id);
        dragContainer.appendChild(dragHandle);
        let addRowBelowButton: HTMLImageElement = document.createElement("img");
        addRowBelowButton.className = "tabButton addRowButton addRowBelowButton";
        addRowBelowButton.src = "/src/assets/images/addRowBelowIcon.png";
        addRowBelowButton.onclick = () => addRow(this.rowBounds, false);
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
        rowTitle.ondrop = (event) => dragOverTextBox(event);
        rowTitle.onfocus = () => clearSelections();
        // Add a vertical div containing the reset button, an empty div, and the delete button to the rowHeader
        let resetDeleteContainer: HTMLDivElement = document.createElement("div");
        resetDeleteContainer.className = "resetDeleteContainer";
        resetDeleteContainer.id = "resetDeleteContainer" + Row.count;
        let resetButton: HTMLDivElement = document.createElement("div");
        resetButton.className = "resetButton resetDeleteButton";
        resetButton.id = "resetButton" + Row.count;
        resetButton.style.backgroundImage = "url('/src/assets/images/RowHeaderClear.png')"; // Set background image for delete button
        resetButton.onclick = () => resetRow(this.rowBody);
        let deleteButton: HTMLDivElement = document.createElement("div");
        deleteButton.className = "deleteButton resetDeleteButton";
        deleteButton.id = "deleteButton" + Row.count;
        deleteButton.style.backgroundImage = "url('/src/assets/images/RowHeaderDelete.png')"; // Set background image for delete button
        deleteButton.onclick = () => deleteRow(this.rowBounds);
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
        // this.rowBody.onclick = (event) => clickContainer(event);
        // this.rowBody.ondragover = (event) => dragImageOver(event);
        // this.rowBody.ondragend = (event) => dragImageEnd(event);
        resetButton.onclick = () => resetRow(this.rowBody);
        // Add the rowBody to the Row
        this.rowFull.appendChild(this.rowBody);
        this.rowBounds.appendChild(this.rowFull);
        Row.count++;
    }
    // Function for appending this row to a parent element
    appendTo(parent: HTMLElement) {
        parent.appendChild(this.rowBounds);
    }
}

// TODO: Rename functions to be Capitalized, as function names should be.

let draggingImageDiv: HTMLDivElement;
let emptyImg: HTMLImageElement = new Image();
emptyImg.src = "/src/assets/images/empty.png";
let selectedImages: Set<HTMLImageElement> = new Set();
let lastSelectedImage: HTMLImageElement;
// DragStart - Mouse is now being held on an image; it is being dragged.
function dragStart(ev: DragEvent) {
    document.body.classList.remove("allow-hover");
    let image: HTMLImageElement | null = ev.target as HTMLImageElement | null;
    if (image) {
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
    // TODO: Reintroduce check to make sure item being dragged in is an image
    // For change to be necessary one of these must have changed: target changed, targetside changed.
    ev.preventDefault();
    let sources: NodeListOf<Element> = document.querySelectorAll("[data-dragging]");
    let element: HTMLElement | null = ev.target as HTMLElement | null; // The element being dragged into.
    if (element) {
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

// FIXME: These functions expect a rowFull, not a rowBounds. What is affected?
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
    rowOrder.splice(rowOrder.indexOf(row.id), 1); // Remove the row from the order list
    // If there is only one row remaining disable the delete button and make it look disabled.
    if (rowList && rowList.childElementCount == 1) {
        let deleteButton: HTMLDivElement = rowList.getElementsByClassName("deleteButton")[0] as HTMLDivElement;
        deleteButton.style.pointerEvents = "none";
        deleteButton.style.opacity = `${0.2}`;
    }
}

// AddRow - Adds a new row above or below the specified row.
function addRow(row: HTMLDivElement, isAbove: boolean) {
    // First check if there is only one row remaining, if so, enable the delete button and make it look enabled.
    if (rowList && rowList.childElementCount == 1) {
        let deleteButton: HTMLDivElement = rowList.getElementsByClassName("deleteButton")[0] as HTMLDivElement;
        deleteButton.style.pointerEvents = "auto";
        deleteButton.style.opacity = `${1}`;
    }
    // Create the new row
    let newRow = new Row(true);
    if (isAbove) row.insertAdjacentElement("beforebegin", newRow.rowBounds);
    else row.insertAdjacentElement("afterend", newRow.rowBounds);
    rowOrder.push(newRow.rowBounds.id); // Keep track of the order of rows
}

interface KeyPairList {
    [key: string]: number;
}
let timeoutIds: KeyPairList = {};
let lastHiddenTab: HTMLDivElement;

function showTab(tab: HTMLDivElement) {
    if (isRowBeingDragged) return; // Do not show any more tabs if one is being dragged already!
    if (lastHiddenTab && lastHiddenTab != tab) {
        hideTab(lastHiddenTab, false);
    }
    clearTimeout(timeoutIds[tab.id]);
    tab.classList.remove("closed");
    lastHiddenTab = tab;
}

function hideTab(tab: HTMLDivElement, useDelay: boolean = true) {
    if (isRowBeingDragged) return; // Is being dragged
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
    selectedImages.clear(); //TESTME: This line might be redundant. And if it is, is the function redundant?
}

function clickContainer(ev: MouseEvent) {
    // Clears selection when clicking on an empty spot of the container
    let container: HTMLDivElement | null = ev.target as HTMLDivElement | null;
    if (container && container.classList.contains("Container")) clearSelections();
}

// dragOverTextBox - drop function for dragging something onto an object that should only hold text, such as a row header.
function dragOverTextBox(ev: DragEvent) {
    let data = ev.dataTransfer;
    if (data && (data.types.length != 1 || data.types[0] != "text/plain")) {
        ev.preventDefault();
    }
    let element = ev.target as HTMLElement;
    console.log(`Dragged something over ${element.id} but this is an invalid drag target`);
    console.log("Data: ", data);
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
function populateInitialRows(rowCount: number) {
    if (rowList)
        for (let i: number = 0; i < rowCount; i++) {
            let newRow = new Row();
            newRow.appendTo(rowList);
            rowOrder.push(newRow.rowBounds.id); // Keep track of the order of rows
        }
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
    let imageContainer: HTMLDivElement | null = document.getElementById("imageContainer") as HTMLDivElement | null;
    if (imageContainer) {
        imageNames.forEach((name) => {
            let image: HTMLImageElement = document.createElement("img");
            image.className = "rankingImage";
            image.src = "/src/assets/images/" + name + ".png";
            image.onclick = (event) => clickImage(event);
            image.ondragstart = (event) => dragStart(event);
            image.ondrag = (event) => dragImage(event);
            imageContainer.appendChild(image);
        });
    } else {
        console.error("Couldn't populate container with placeholders because imageContainer was not null.");
    }
}

// type DragState = {
//     draggedRow: HTMLElement;
//     initialIndex: number;
//     initialY: number;
//     neighborDistance: number;
// };
// let dragState: DragState | null = null;

// // MouseDownRow - Function to handle mouse down a row when the drag handle is dragged
// function OnRowMouseDown(event: MouseEvent, row: HTMLDivElement) {
//     if (!rowList) return;
//     // Set this row as currently being moved
//     const style = window.getComputedStyle(rowList);
//     let gap: number = parseFloat(style.rowGap);
//     console.log("gap: " + gap);
//     dragState = {
//         draggedRow: row,
//         initialIndex: Array.from(rowList.children).indexOf(row),
//         initialY: event.clientY,
//         neighborDistance: row.offsetHeight + (Number.isNaN(gap) ? 0 : gap),
//     };
//     // Add class for being dragged
//     dragState.draggedRow.classList.add("dragging");

//     // Temporarily add the listeners for mouse movement
//     document.addEventListener("mousemove", OnRowMouseMove);
//     document.addEventListener("mouseup", OnRowMouseUp);

//     console.log("OnRowMouseDown activated...");
// }

// // TODO: Implement touch support?
// // OnRowMove - On Mouse Move listener for moving mouse when row is dragged
// function OnRowMouseMove(event: MouseEvent) {
//     if (!rowList || !dragState) return; // There's nothing being dragged.

//     // Calculate the delta from the original position
//     const deltaY = dragState.initialY - event.clientY;
//     let newIndexRaw = dragState.initialIndex - Math.round(deltaY / dragState.neighborDistance);
//     const newIndex = Math.max(0, Math.min(rowList.children.length, newIndexRaw));
//     console.log("DeltaY: " + deltaY);
//     console.log("NeighborDistance: " + dragState.neighborDistance);

//     if (newIndex !== dragState.initialIndex) {
//         const referenceRow = rowList.children[newIndex] || null;
//         rowList.insertBefore(dragState.draggedRow!, referenceRow);
//         dragState.initialY = event.clientY;
//         dragState.initialIndex = newIndex;
//     }
//     console.log("OnRowMouseMove activated...");
// }
// // OnRowUp - On Mouse Up listener for letting go of dragged row
// function OnRowMouseUp(event: MouseEvent) {
//     if (dragState) {
//         dragState.draggedRow.classList.remove("dragging");
//         dragState = null;
//     }
//     document.removeEventListener("mousemove", OnRowMouseMove);
//     document.removeEventListener("mouseup", OnRowMouseUp);
//     console.log("OnRowMouseUp activated...");
// }

let isRowBeingDragged = false;
function onRowDragStart(event: DragEvent, rowBeingDraggedID: string) {
    event.dataTransfer?.setData("sourceRowID", rowBeingDraggedID);
    event.dataTransfer?.setData("dragType", "ROWTAB");
    const img = new Image();
    img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAn8B9p6rU9wAAAAASUVORK5CYII=";
    event.dataTransfer?.setDragImage(img, 0, 0);
    console.log(`Row ${rowBeingDraggedID} is being dragged.`);
}

function OnRowDragOver(event: DragEvent, rowBeingDraggedOver: HTMLDivElement) {
    console.log(`Row ${rowBeingDraggedOver.id} is being dragged over...`);
    // If the event is not a row drag, then we ignore the event.
    let eventType = event.dataTransfer?.getData("dragType");
    if (eventType !== "ROWTAB") return;

    // Get the Row being dragged over us. If it IS this row, then we ignore the event.
    let sourceRowID: string | null = event.dataTransfer?.getData("sourceRowID") || null;
    if (!sourceRowID || sourceRowID === rowBeingDraggedOver.id) return;

    // Find indices in the order array
    const overIndex = rowOrder.indexOf(rowBeingDraggedOver.id);
    const sourceIndex = rowOrder.indexOf(sourceRowID);
    if (overIndex === -1 || sourceIndex === -1) return;

    // If we are here, then we are being dragged over by a row that is unique.
    event.preventDefault();
    isRowBeingDragged = true;

    // Determine if the item is currently being dragged over the lower or upper half of our current row
    let rect: DOMRect = rowBeingDraggedOver.getBoundingClientRect();
    let isLowerHalf: boolean = event.clientY > (rect.top + rect.bottom) / 2;

    // Remove the source from its current position
    rowOrder.splice(sourceIndex, 1);

    // Insert at the new position
    let insertIndex = isLowerHalf ? overIndex + 1 : overIndex;
    if (sourceIndex < insertIndex) insertIndex--; // Adjust for removal if moving down
    rowOrder.splice(insertIndex, 0, sourceRowID);

    // Update the style.order for all rows
    rowOrder.forEach((rowId: string, idx: number) => {
        const rowElem = document.getElementById(rowId);
        if (rowElem) rowElem.style.order = idx.toString();
    });
}

function OnRowDragEnd(event: DragEvent, rowBeingDraggedOver: HTMLDivElement) {
    if (isRowBeingDragged) isRowBeingDragged = false; // Reset the flag
    console.log(`Row ${rowBeingDraggedOver.id} is no longer being dragged.`);
}

// Global array to track the order of rowBounds IDs
let rowOrder: string[] = [];

function main() {
    const STARTING_ROW_COUNT: number = 5; // Number of rows to start with
    populateInitialRows(STARTING_ROW_COUNT); // Make the original starting rows
    populatePlaceholderImages(); //Put in the placeholders
}
main();

// TODO: Enable extra tsconfig settings. https://youtu.be/d56mG7DezGs?t=2601
// TODO: Add return types to all functions
//TODO: Update code formatting. Switch to proper tab indentation?
// TODO: Remove redundant typing, a lot of this is already obvious

// function updateHeaderText(event: Event): void {
//     let keyPressed = event as KeyboardEvent;
//     if (keyPressed.key === "Enter") {
//         console.log("Enter pressed");
//         keyPressed.preventDefault();
//     }
//     let headerText = event.target as HTMLInputElement;
//     headerText.style.height = "";
//     headerText.style.height = `${headerText.scrollHeight}px`;
// }
