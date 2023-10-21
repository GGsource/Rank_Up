class RankRow {
    // TODO: Rework this class to be a row made up of a rowHeader, rowBody, and a rowTab.
    // TODO: rowTab will be the left-most element that will be used to drag the row up and down, as well as have buttons to add a new row above or below it.
    // TODO: rowHeader will be the element that contains the row's title and the row's delete and reset buttons.
    // TODO: rowBody will be the element that contains the row's ranking images.
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

        // Add a custom event listener that logs all the events fired on the element
        this.element.addEventListener('all', (event) => console.log(event.type));
    }
}

startingRowCount = 5;
for (i = 0; i < startingRowCount; i++) {
    new RankRow("row" + (i + 1));
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