let size = 8;

let configMenu;
let gameView;

function goToGame() {
  configMenu.hidden = true;
  gameView.hidden = false;
  startGame();
  console.log(state);
}

function goBackToConfig() {
  gameView.hidden = true;
  configMenu.hidden = false;
}

function generateSelectTable() {
  let table = document.getElementById("selectPositionTable");
  //Clear table
  let child = table.lastElementChild;
  if (child) {
    table.removeChild(child);
  }

  //Generate new elements
  let boardSizeSelect = document.getElementById("boardSizeSelect");
  size = boardSizeSelect.value;
  let row = document.createElement("tr");

  //Append king
  let column = document.createElement("td");
  column.innerHTML = "Król";
  row.appendChild(column);

  let select;
  for (let i = 1; i < size - 1; i++) {
    column = document.createElement("td");
    select = document.createElement("select");
    select.id = "pieceSelect" + i;
    select.name = "pieceSelect" + i;
    //Append options
    let option = document.createElement("option");
    option.value = "knight";
    option.innerHTML = "Skoczek";
    select.appendChild(option);

    option = document.createElement("option");
    option.value = "rook";
    option.innerHTML = "Wieża";
    select.appendChild(option);

    option = document.createElement("option");
    option.value = "none";
    option.innerHTML = "Brak";
    select.appendChild(option);

    column.appendChild(select);
    row.appendChild(column);
  }

  //Append other king
  column = document.createElement("td");
  column.innerHTML = "Król";
  row.appendChild(column);

  table.appendChild(row);
  saveConfig();
}

function saveConfig() {
  boardSize = size;
}

window.addEventListener("load", function () {
  configMenu = document.getElementById("configMenu");
  gameView = document.getElementById("gameView");
});
