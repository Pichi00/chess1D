const board = document.getElementById("board");
const BOARD_SIZE = 8;
const defaultBoardArray = ["K", "N", "R", "0", "0", "r", "n", "k"];

let boardArray;
let whiteMove = true;
let selectedPiece = null;

function setUpGame() {
  boardArray = defaultBoardArray;

  //Create squares on board
  for (let i = 0; i < BOARD_SIZE; i++) {
    let square = document.createElement("div");
    square.className = "square " + i;

    square.style.backgroundColor = "#F0D9B5";
    if (i % 2) square.style.backgroundColor = "#B58863";

    if (boardArray[i] != "0") {
      let piece = document.createElement("img");
      piece.className = "piece " + boardArray[i] + " " + i;
      piece.style.width = "100px";
      piece.src = setPieceImg(boardArray[i]);

      /*piece.onclick = function () {
        console.log(piece);
        checkAvaliableMoves(piece);
      };*/

      square.appendChild(piece);
    }

    square.onmousedown = function () {
      let currentPiece = square.childNodes[0];
      if (currentPiece != undefined) {
        checkAvaliableMoves(currentPiece);
      }
      if (selectedPiece == null) {
        selectedPiece = currentPiece;
      } else {
        console.log("move " + selectedPiece + " to " + square.classList[1]);
        selectedPiece = null;
      }
    };

    board.append(square);
  }
  let p = document.createElement("p");
  board.append(p);

  for (let i = 0; i < BOARD_SIZE; i++) {
    let numSquare = document.createElement("div");
    numSquare.className = "numSquare";
    //numSquare.style.backgroundColor = "#B58863";
    //if (i % 2) numSquare.style.backgroundColor = "#F0D9B5";
    numSquare.textContent = i;
    board.append(numSquare);
  }
}

function setPieceImg(type) {
  if (type == "K") {
    return "img/kw.png";
  }
  if (type == "N") {
    return "img/nw.png";
  }
  if (type == "R") {
    return "img/rw.png";
  }
  if (type == "k") {
    return "img/kb.png";
  }
  if (type == "n") {
    return "img/nb.png";
  }
  if (type == "r") {
    return "img/rb.png";
  }
}

function checkAvaliableMoves(piece) {
  pieceType = piece.classList[1];
  pieceColor(pieceType);
}

function move(startSquare, destSquare) {
  boardArray[destSquare] = selectedPiece.classList[1];
  boardArray[startSquare] = "0";
  console.log(boardArray);
}

function pieceColor(pieceType) {
  if (pieceType == pieceType.toUpperCase()) {
    console.log("white");
  } else {
    console.log("black");
  }
}

window.onload = function () {
  setUpGame();
};
