let size = 8;

let configMenu;
let gameView;

function goToGame() {
  configMenu.hidden = true;
  gameView.hidden = false;
  saveConfig();
  startGame();
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

  appendChildSelectPiece(column, row, 1, 3);
  appendChildSelect(column, row, 3, Math.floor(size / 2));
  if (size % 2 == 0) {
    appendChildSelect(column, row, Math.floor(size / 2), size - 3);
  } else {
    column = document.createElement("td");
    column.innerHTML = "Brak";
    row.appendChild(column);
    appendChildSelect(column, row, Math.floor(size / 2) + 1, size - 3);
  }
  appendChildSelectPiece(column, row, size - 3, size - 1);

  //Append other king
  column = document.createElement("td");
  column.innerHTML = "Król";
  row.appendChild(column);

  table.appendChild(row);
}

function appendChildSelectPiece(column, row, start, end) {
  let select;
  let option;
  for (let i = start; i < end; i++) {
    column = document.createElement("td");
    select = document.createElement("select");
    select.id = "pieceSelect" + i;
    select.name = "pieceSelect" + i;
    //Append options
    option = document.createElement("option");
    option.value = "N";
    option.innerHTML = "Skoczek";
    select.appendChild(option);

    option = document.createElement("option");
    option.value = "R";
    option.innerHTML = "Wieża";
    select.appendChild(option);

    column.appendChild(select);
    row.appendChild(column);
  }
}

function appendChildSelect(column, row, start, end) {
  let select;
  let option;
  for (let i = start; i < end; i++) {
    column = document.createElement("td");
    select = document.createElement("select");
    select.id = "pieceSelect" + i;
    select.name = "pieceSelect" + i;
    //Append options
    option = document.createElement("option");
    option.value = "0";
    option.innerHTML = "Brak";
    select.appendChild(option);

    option = document.createElement("option");
    option.value = "N";
    option.innerHTML = "Skoczek";
    select.appendChild(option);

    option = document.createElement("option");
    option.value = "R";
    option.innerHTML = "Wieża";
    select.appendChild(option);

    column.appendChild(select);
    row.appendChild(column);
  }
}

function saveConfig() {
  //Set board size
  boardSize = size;

  //Set default board array
  let position = [];
  position.push("K");
  let table = document.getElementById("selectPositionTable");
  let row = table.childNodes[1];

  for (let i = 1; i < size / 2; i++) {
    let piece = row.childNodes[i].childNodes[0].value;
    position.push(piece[0].toUpperCase());
  }

  for (let i = Math.ceil(size / 2); i < size - 1; i++) {
    let piece = row.childNodes[i].childNodes[0].value;
    position.push(piece[0].toLowerCase());
  }

  position.push("k");
  defaultBoardArray = position;
}

window.addEventListener("load", function () {
  configMenu = document.getElementById("configMenu");
  gameView = document.getElementById("gameView");
  generateSelectTable();
  saveConfig();
});
