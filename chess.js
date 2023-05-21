let boardDiv, canvas, ctx;
const boardSize = 8;
const squareSize = 100;
const defaultBoardArray = ["K", "N", "R", "0", "0", "r", "n", "k"];
const whitePieces = ["K", "N", "R"];
const blackPieces = ["k", "n", "r"];

let boardArray = defaultBoardArray;

const States = { SELECT: "SELECT", MOVE: "MOVE" };
let state = States.SELECT;
let whiteMove = true;
let selectedPiece = null;
let selectedSquare = null;

function getImagesfromDom() {
  let pieces = {
    K: document.getElementById("white-king"),
    N: document.getElementById("white-knight"),
    R: document.getElementById("white-rook"),
    k: document.getElementById("black-king"),
    n: document.getElementById("black-knight"),
    r: document.getElementById("black-rook"),
  };

  return pieces;
}

function drawBoard(ctx, selectedSquare) {
  let lightColor = "#F0D9B5";
  let darkColor = "#B58863";
  let pieces = getImagesfromDom();

  ctx.fillStyle = "#4a433e";
  ctx.fillRect(0, 100, boardSize * squareSize, 30);
  // draw board squares
  for (let i = 0; i < boardSize; i++) {
    if (i % 2 == 0) {
      ctx.fillStyle = darkColor;
    } else {
      ctx.fillStyle = lightColor;
    }

    ctx.fillRect(i * 100, 0, squareSize, squareSize);
    // draw square number
    ctx.font = "24px serif";
    ctx.fillStyle = "white";
    ctx.fillText(i.toString(), i * squareSize + 45, squareSize + 22);
  }

  //  draw selected square
  if (state === States.SELECT && selectedSquare != null) {
    ctx.fillStyle = "#edc915";
    ctx.globalAlpha = 0.4;
    ctx.fillRect(selectedSquare * 100, 0, squareSize, squareSize);
    ctx.globalAlpha = 1.0;
  }

  // draw pieces
  for (i in boardArray) {
    if (boardArray[i] != "0") {
      ctx.drawImage(
        pieces[boardArray[i]],
        i * squareSize,
        0,
        squareSize,
        squareSize
      );
    }
  }
}

function setUpCanvas(canvas) {
  canvas.id = "canvas";
  canvas.width = boardSize * 100;
  canvas.height = squareSize + 30;

  canvas.style.zIndex = 8;
  canvas.style.position = "absolute";
  canvas.style.border = "1px solid";

  canvas.addEventListener("mousedown", function (e) {
    if (state === States.SELECT) {
      selectPiece(e);
    } else if (state === States.MOVE) {
      movePiece(e);
    }
    //console.log(getMousePosition(e));
    //console.log(getSquareFromClick(e));
  });
}

function selectPiece(e) {
  selectedSquare = getSquareFromClick(e);
  if (whiteMove) {
    if (whitePieces.includes(boardArray[selectedSquare])) {
      checkAvaliableMoves(selectedSquare);
      drawBoard(ctx, selectedSquare);
      state = States.MOVE;
    }
  } else {
    if (blackPieces.includes(boardArray[selectedSquare])) {
      selectedPiece = boardArray[selectedSquare];
      drawBoard(ctx, selectedSquare);
      state = States.MOVE;
    }
  }
}

function movePiece(e) {
  let newSquare = getSquareFromClick(e);
  let avaliableMoves = checkAvaliableMoves(selectedSquare);
  if (avaliableMoves.includes(newSquare)) {
    boardArray[newSquare] = boardArray[selectedSquare];
    boardArray[selectedSquare] = "0";
    drawBoard(ctx, selectedSquare);
    state = States.SELECT;
    whiteMove = !whiteMove;
  } else {
    selectedSquare = null;
    state = States.SELECT;
    drawBoard(ctx, selectedSquare);
  }
}

function checkAvaliableMoves(n) {
  let piece = boardArray[n];
  let avaliableMoves = [];

  // Rooks moves
  if (piece === "R" || piece === "r") {
    // Moves right
    for (let i = n; i < boardSize - 1; i++) {
      if (boardArray[i + 1] === "0") {
        avaliableMoves.push(i + 1);
      } else if (!arePiecesSameType(piece, boardArray[i + 1])) {
        avaliableMoves.push(i + 1);
        break;
      } else {
        break;
      }
    }
    // Moves left
    for (let i = n; i > 0; i--) {
      if (boardArray[i - 1] === "0") {
        avaliableMoves.push(i - 1);
      } else if (!arePiecesSameType(piece, boardArray[i - 1])) {
        avaliableMoves.push(i - 1);
        break;
      } else {
        break;
      }
    }
  }

  // Knights moves
  else if (piece === "N" || piece === "n") {
    // Move right
    if (
      boardArray[n + 2] != undefined &&
      !arePiecesSameType(piece, boardArray[n + 2])
    ) {
      avaliableMoves.push(n + 2);
    }
    // Move left
    if (
      boardArray[n - 2] != undefined &&
      !arePiecesSameType(piece, boardArray[n - 2])
    ) {
      avaliableMoves.push(n - 2);
    }
  }

  console.log(avaliableMoves);
  return avaliableMoves;
}

function arePiecesSameType(p1, p2) {
  if (getPieceColor(p1) === getPieceColor(p2)) {
    return true;
  }
  return false;
}

function getPieceColor(piece) {
  if (piece === "0" || piece === undefined || piece === null) {
    return "none";
  } else if (piece === piece.toUpperCase()) {
    return "white";
  } else if (piece === piece.toLowerCase()) {
    return "black";
  }
}
/*function getCursorPosition(e, canvas) {
  let x, y;

  canoffset = canvas.offset();
  x =
    e.clientX +
    document.body.scrollLeft +
    document.documentElement.scrollLeft -
    Math.floor(canoffset.left);
  y =
    e.clientY +
    document.body.scrollTop +
    document.documentElement.scrollTop -
    Math.floor(canoffset.top) +
    1;

  return [x, y];
}*/

function getMousePosition(evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}

function getSquareFromClick(e) {
  return Math.floor(getMousePosition(e).x / 100);
}

window.addEventListener("load", function () {
  boardDiv = document.getElementById("board");
  canvas = document.createElement("canvas");
  ctx = canvas.getContext("2d");
  setUpCanvas(canvas, ctx);
  boardDiv.appendChild(canvas);
  drawBoard(ctx);
});
