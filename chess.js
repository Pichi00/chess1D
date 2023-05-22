let boardDiv, canvas, ctx;
const boardSize = 8;
const squareSize = 100;
const defaultBoardArray = ["K", "N", "R", "0", "0", "r", "n", "k"];
const whitePieces = ["K", "N", "R"];
const blackPieces = ["k", "n", "r"];

let boardArray = defaultBoardArray;
let legalMoves = {};

const States = { SELECT: "SELECT", MOVE: "MOVE", GAMEOVER: "GAMEOVER" };
let state = States.SELECT;
let whiteMove = true;
let selectedPiece = null;
let selectedSquare = null;
let positions = {};

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
    ctx.fillText((i + 1).toString(), i * squareSize + 45, squareSize + 22);
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

  //canvas.style.zIndex = 8;
  //canvas.style.position = "absolute";
  canvas.style.border = "2px solid";

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
      checkAvaliableMoves(selectedSquare);
      drawBoard(ctx, selectedSquare);
      state = States.MOVE;
    }
  }
}

function movePiece(e) {
  let newSquare = getSquareFromClick(e);
  let allLegalMoves = checkLegalMoves();
  let legalMoves = allLegalMoves[boardArray[selectedSquare]];
  if (legalMoves != undefined && legalMoves.includes(newSquare)) {
    boardArray[newSquare] = boardArray[selectedSquare];
    boardArray[selectedSquare] = "0";
    drawBoard(ctx, selectedSquare);
    state = States.SELECT;
    whiteMove = !whiteMove;
    addPosition();
  } else {
    selectedSquare = null;
    state = States.SELECT;
    drawBoard(ctx, selectedSquare);
  }
  allLegalMoves = checkLegalMoves();
  if (Object.keys(allLegalMoves).length == 0 && ifIsCheck()) {
    state = States.GAMEOVER;
    console.log(whiteMove ? "Black" : "White", "won by checkmate");
  } else if (Object.keys(allLegalMoves).length == 0) {
    state = States.GAMEOVER;
    console.log("Draw by stealmate");
  }
}

function checkAvaliableMoves(n) {
  let piece = boardArray[n];
  let avaliableMoves = [];
  //console.log(piece);
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

  // King moves
  else if (piece === "K" || piece === "k") {
    // Move right
    if (
      boardArray[n + 1] != undefined &&
      !arePiecesSameType(piece, boardArray[n + 1])
    ) {
      avaliableMoves.push(n + 1);
    }
    // Move left
    if (
      boardArray[n - 1] != undefined &&
      !arePiecesSameType(piece, boardArray[n - 1])
    ) {
      avaliableMoves.push(n - 1);
    }
  }

  //console.log(avaliableMoves);
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

function checkLegalMoves() {
  let legalMoves = {};

  for (let i = 0; i < boardArray.length; i++) {
    let pieceColor = getPieceColor(boardArray[i]);
    if (
      (whiteMove && pieceColor === "black") ||
      (!whiteMove && pieceColor === "white")
    ) {
      continue;
    }

    let avaliableMoves = checkAvaliableMoves(i);
    for (move in avaliableMoves) {
      if (checkIfLegalMove(i, avaliableMoves[move])) {
        if (legalMoves[boardArray[i]] === undefined) {
          legalMoves[boardArray[i]] = [];
        }
        legalMoves[boardArray[i]].push(avaliableMoves[move]);
      }
    }
  }
  return legalMoves;
}

function checkIfLegalMove(posStart, posEnd) {
  let boardArrCopy = boardArray.slice();
  let color = getPieceColor(boardArray[posStart]);
  boardArrCopy[posEnd] = boardArrCopy[posStart];
  boardArrCopy[posStart] = "0";
  let rookPos;
  let knightPos;
  let wKingPos = boardArrCopy.indexOf("K");
  let bKingPos = boardArrCopy.indexOf("k");
  switch (color) {
    case "white":
      rookPos = boardArrCopy.indexOf("r");
      knightPos = boardArrCopy.indexOf("n");
      wKingPos = boardArrCopy.indexOf("K");

      // Check if black rook attacks king
      if (rookPos > wKingPos) {
        if (ifRookAttacksKing(boardArrCopy, wKingPos, rookPos)) {
          return false;
        }
      }
      // Check if black knight attacks king
      if (knightPos >= 0) {
        if (knightPos === wKingPos + 2 || knightPos === wKingPos - 2) {
          return false;
        }
      }
      break;
    case "black":
      rookPos = boardArrCopy.indexOf("R");
      knightPos = boardArrCopy.indexOf("N");
      // Check if white rook attacks king
      if (bKingPos > rookPos) {
        if (ifRookAttacksKing(boardArrCopy, rookPos, bKingPos)) {
          return false;
        }
      }
      // Check if white knight attacks king
      if (knightPos >= 0) {
        if (knightPos === bKingPos + 2 || knightPos === bKingPos - 2) {
          return false;
        }
      }
      break;
    default:
      return false;
  }
  if (wKingPos === bKingPos - 1 || wKingPos == bKingPos + 1) {
    return false;
  }
  return true;
}

function ifRookAttacksKing(boardArr, startPos, endPos) {
  for (let i = startPos + 1; i < endPos; i++) {
    if (boardArr[i] != "0") {
      return false;
    }
  }
  return true;
}

function ifIsCheck() {
  let wKingPos = boardArray.indexOf("K");
  let bKingPos = boardArray.indexOf("k");
  let wRookPos = boardArray.indexOf("R");
  let bRookPos = boardArray.indexOf("r");
  let wKnightPos = boardArray.indexOf("N");
  let bKnightPos = boardArray.indexOf("n");
  if (whiteMove) {
    if (bRookPos > wKingPos) {
      if (ifRookAttacksKing(boardArray, wKingPos, bRookPos)) {
        return true;
      }
    }
    if (
      bKnightPos > 0 &&
      (bKnightPos === wKingPos + 2 || bKnightPos === wKingPos - 2)
    ) {
      return true;
    }
  } else {
    if (bKingPos > wRookPos) {
      if (ifRookAttacksKing(boardArray, wRookPos, bKingPos)) {
        return true;
      }
    }
    if (
      wKnightPos > 0 &&
      (wKnightPos === bKingPos + 2 || wKnightPos === bKingPos - 2)
    ) {
      return true;
    }
  }
  return false;
}

function addPosition() {
  if (Object.keys(positions).includes(boardArray.toString())) {
    positions[boardArray] += 1;
  } else {
    positions[boardArray] = 1;
  }
  if (positions[boardArray] >= 3) {
    state = States.GAMEOVER;
    console.log("Draw by repetition");
  }
}

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

function setUpGame() {
  boardDiv = document.getElementById("board");
  canvas = document.createElement("canvas");
  ctx = canvas.getContext("2d");
  setUpCanvas(canvas, ctx);
  boardDiv.appendChild(canvas);
  drawBoard(ctx);
  positions = {};
  addPosition();
}
window.addEventListener("load", function () {
  setUpGame();
});
