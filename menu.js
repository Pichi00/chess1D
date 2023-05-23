let size = 8;

let configMenu;
let configContainer;
let gameView;
let customConfigCheckbox;

let custom = false;

function goToGame() {
  configMenu.hidden = true;
  gameView.hidden = false;
  if (custom) {
    saveConfig();
  }
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
  column.style.color = "white";
  row.appendChild(column);

  appendChildSelectPiece(row, 1, 3, "white");
  appendChildSelect(row, 3, Math.floor(size / 2), "white");
  if (size % 2 == 0) {
    appendChildSelect(row, Math.floor(size / 2), size - 3, "black");
  } else {
    column = document.createElement("td");
    column.innerHTML = "Brak";
    row.appendChild(column);
    appendChildSelect(row, Math.floor(size / 2) + 1, size - 3, "black");
  }
  appendChildSelectPiece(row, size - 3, size - 1, "black");

  //Append other king
  column = document.createElement("td");
  column.innerHTML = "Król";
  column.style.color = "black";
  row.appendChild(column);

  table.appendChild(row);
}

function appendChildSelectPiece(row, start, end, color) {
  let select;
  let option;
  let column;
  for (let i = start; i < end; i++) {
    column = document.createElement("td");

    select = document.createElement("select");
    select.style.color = color;
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

function appendChildSelect(row, start, end, color) {
  let select;
  let option;
  for (let i = start; i < end; i++) {
    column = document.createElement("td");

    select = document.createElement("select");
    select.style.color = color;
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
    if (piece != undefined) {
      position.push(piece[0].toUpperCase());
    } else {
      position.push("0");
    }
  }

  for (let i = Math.ceil(size / 2); i < size - 1; i++) {
    let piece = row.childNodes[i].childNodes[0].value;
    if (piece != undefined) {
      position.push(piece[0].toLowerCase());
    } else {
      position.push("0");
    }
  }

  position.push("k");
  defaultBoardArray = position;
}

function toggleConfig() {
  custom = customConfigCheckbox.checked;
  configContainer.hidden = !custom;
  if (!custom) {
    defaultBoardArray = ["K", "N", "R", "0", "0", "r", "n", "k"];
    boardSize = 8;
  }
}

window.addEventListener("load", function () {
  configMenu = document.getElementById("configMenu");
  gameView = document.getElementById("gameView");
  configContainer = document.getElementById("configContainer");
  customConfigCheckbox = document.getElementById("customConfigCheckbox");
  generateSelectTable();
});
