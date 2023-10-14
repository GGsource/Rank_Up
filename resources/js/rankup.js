// window.onload = function () {
//     var table = document.getElementById("mainTable")
//     // Start the table with 3 rows and 2 columns
//     var rows = 5
//     var cols = 5
//     for (var i = 0; i < rows; i++) {
//         var row = table.insertRow(i)
//         for (var j = 0; j < cols + 1; j++) {
//             var cell = row.insertCell(j)
//             if (j == 0) {
//                 cell.innerHTML = "row " + i
//                 // Give these cells a class name of rowHeader so we can style them later
//                 cell.className = "rowHeader"
//             }
//             else
//                 cell.innerHTML = "cell " + i + "," + (j - 1)
//         }
//     }
// }

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