class RankRow {
    constructor(id) {
        this.element = document.createElement("div");
        this.element.id = id;
        this.element.className = "RankRow Container";
        // this.element.onmouseover = () => showPlusButton();
        // On mouseover pass which button was hovered over to the showPlusButton function
        this.element.onmouseover = () => showPlusButton(this.element);
        this.element.onmouseout = () => hidePlusButton();
        this.element.ondrop = (event) => drop(event);
        this.element.ondragover = (event) => allowDrop(event);
        this.element.ondragend = (event) => dragEnd(event);

        // Add this new row to the rowContainer
        const rowContainer = document.getElementById("rowList");
        rowContainer.appendChild(this.element);
    }
}

class rowFull {
    constructor(id) {
        // DONE: Rework this class to be a row made up of a rowHeader, rowBody, and a rowTab. MainRow contains header and body, and rowTab is outside of MainRow inside rowFull.
        let rowFull = document.createElement("div");
        rowFull.className = "rowFull";
        rowFull.id = "rowFull" + id;
        // Create inbetween wrapper
        let inLineWrapper = document.createElement("div");
        inLineWrapper.className = "inLineWrapper";
        inLineWrapper.id = "inLineWrapper" + id;
        // DONE: rowTab will be the left-most element that will be used to drag the row up and down, as well as have buttons to add a new row above or below it.
        // rowTab consists of an addRowAbove button, an addRowBelow button, and a drag handle in between, stacked vertically.
        let rowTab = document.createElement("div");
        rowTab.className = "rowTab rowPiece";
        rowTab.id = "rowTab" + id;
        // Add the addRowAbove button, the addRowBelow button, and the drag handle to the rowTab
        let addRowAboveButtonImage = document.createElement("img");
        addRowAboveButtonImage.src = "/resources/images/addRowAboveIcon.png";
        addRowAboveButtonImage.className = "addRowButtonImage addRowButton tabButton";
        let dragHandle = document.createElement("div");
        dragHandle.className = "dragHandle tabButton";
        dragHandle.innerHTML = "|||";
        let addRowBelowButtonImage = document.createElement("img");
        addRowBelowButtonImage.src = "/resources/images/addRowBelowIcon.png";
        addRowBelowButtonImage.className = "addRowButtonImage addRowButton tabButton";
        rowTab.appendChild(addRowAboveButtonImage);
        rowTab.appendChild(dragHandle);
        rowTab.appendChild(addRowBelowButtonImage);
        // Add the rowTab to the wrapper, outside the mainRow
        inLineWrapper.appendChild(rowTab);
        // DONE: mainRow will be the element that contains the rowHeader and rowBody.
        let MainRow = document.createElement("div");
        MainRow.className = "mainRow";
        MainRow.id = "rowFull" + id;
        // MainRow.onmouseover = () => showPlusButton(); TODO: Make these show the rowTab and hide the rowTab when the mouse is over the rowTab
        // MainRow.onmouseout = () => hidePlusButton();
        // DONE: rowHeader will be the element that contains the row's title and the row's delete and reset buttons.
        // rowHeader consists of the title on the left, and the delete and reset buttons on the right side corners. The reset button is in the top right corner, and the delete button is in the bottom right corner. This can be done with a flexbox and an empty between the two buttons vertically.
        let rowHeader = document.createElement("div");
        rowHeader.className = "rowHeader rowPiece";
        rowHeader.id = "rowHeader" + id;
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
        deleteButton.appendChild(deleteButtonImage);
        resetDeleteContainer.appendChild(resetButton);
        resetDeleteContainer.appendChild(emptyDiv);
        resetDeleteContainer.appendChild(deleteButton);
        // Add the rowTitle and the resetDeleteContainer to the rowHeader
        rowHeader.appendChild(rowTitle);
        rowHeader.appendChild(resetDeleteContainer);
        // Add the rowHeader to the mainRow
        MainRow.appendChild(rowHeader);
        // DONE: rowBody will be the element that contains the row's ranking images.
        // rowBody is the container the user will drag the images into to rank them.
        let rowBody = document.createElement("div");
        rowBody.className = "rowBody rowPiece";
        rowBody.id = "rowBody" + id;
        rowBody.ondrop = (event) => drop(event);
        rowBody.ondragover = (event) => allowDrop(event);
        rowBody.ondragend = (event) => dragEnd(event);
        // Add the rowBody to the mainRow
        MainRow.appendChild(rowBody);

        // Add the mainRow to the rowWrapper
        inLineWrapper.appendChild(MainRow);
        // Add the rowWrapper to the rowFull
        rowFull.appendChild(inLineWrapper);
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
        console.log(data);
        console.log(document.getElementById(data));
        ev.target.appendChild(document.getElementById(data));
    }
}

function dragEnd(ev) {
    // ev.target.style.visibility = "visible";
}

// function showPlusButton(element) {
//     const plusButton = document.createElement("div");
//     plusButton.className = "plusButton";
//     plusButton.innerHTML = "+";
//     // plusButton.onclick = () => addRow();
//     // Add the button to the container
//     const rowContainer = document.getElementById("rowList");

// }

// function hidePlusButton() {
//     const plusButton = document.getElementsByClassName("plusButton")[0];
//     plusButton.remove();
// }