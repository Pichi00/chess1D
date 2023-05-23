let boardDiv, canvas, ctx;
const squareSize = 100;
const whitePieces = ["K", "N", "R"];
const blackPieces = ["k", "n", "r"];

//Buttons
let gameResult;
let backButton;

let boardArray = [];
let legalMoves = {};

const States = {
  SELECT: "SELECT",
  MOVE: "MOVE",
  GAMEOVER: "GAMEOVER",
};
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
  let legalMoves = allLegalMoves[boardArray[selectedSquare] + selectedSquare];
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
    gameResult.hidden = false;
    gameResult.innerText = "Szach mat! Zwycięstwo ";
    gameResult.innerText += whiteMove ? " czarnych" : " białych";
    resetGameButton.hidden = false;
    backButton.hidden = false;
  } else if (Object.keys(allLegalMoves).length == 0) {
    state = States.GAMEOVER;
    gameResult.hidden = false;
    gameResult.innerText = "Remis przez pata";
    resetGameButton.hidden = false;
    backButton.hidden = false;
  }
  checkIfEnoughMaterial();
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
        if (legalMoves[boardArray[i] + i] === undefined) {
          legalMoves[boardArray[i] + i] = [];
        }
        legalMoves[boardArray[i] + i].push(avaliableMoves[move]);
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

  let wKingPos = boardArrCopy.indexOf("K");
  let bKingPos = boardArrCopy.indexOf("k");
  let rookIndexes = [];
  let knightIndexes = [];
  let i = -1;
  switch (color) {
    case "white":
      rookPos = boardArrCopy.indexOf("r");
      wKingPos = boardArrCopy.indexOf("K");

      // Check if black rook attacks king
      i = -1;
      rookIndexes = [];
      while ((i = boardArrCopy.indexOf("r", i + 1)) !== -1) {
        rookIndexes.push(i);
      }
      for (index in rookIndexes) {
        if (rookIndexes[index] > wKingPos) {
          if (ifRookAttacksKing(boardArrCopy, wKingPos, rookIndexes[index])) {
            return false;
          }
        }
      }

      // Check if black knight attacks king
      i = -1;
      knightIndexes = [];

      while ((i = boardArrCopy.indexOf("n", i + 1)) !== -1) {
        knightIndexes.push(i);
      }

      for (index in knightIndexes) {
        if (knightIndexes[index] >= 0) {
          if (
            knightIndexes[index] === wKingPos + 2 ||
            knightIndexes[index] === wKingPos - 2
          ) {
            return false;
          }
        }
      }
      break;
    case "black":
      // Check if white rook attacks king
      i = -1;
      rookIndexes = [];
      while ((i = boardArrCopy.indexOf("R", i + 1)) !== -1) {
        rookIndexes.push(i);
      }
      for (index in rookIndexes) {
        if (bKingPos > rookIndexes[index]) {
          if (ifRookAttacksKing(boardArrCopy, rookIndexes[index], bKingPos)) {
            return false;
          }
        }
      }
      // Check if white knight attacks king
      i = -1;
      knightIndexes = [];

      while ((i = boardArrCopy.indexOf("N", i + 1)) !== -1) {
        knightIndexes.push(i);
      }

      for (index in knightIndexes) {
        if (knightIndexes[index] >= 0) {
          if (
            knightIndexes[index] === bKingPos + 2 ||
            knightIndexes[index] === bKingPos - 2
          ) {
            return false;
          }
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
  let wRookIndexes = [];
  let bRookIndexes = [];
  let wKnightIndexes = [];
  let bKnightIndexes = [];
  let i = -1;
  if (whiteMove) {
    i = -1;
    bRookIndexes = [];
    while ((i = boardArray.indexOf("r", i + 1)) !== -1) {
      bRookIndexes.push(i);
    }
    for (index in bRookIndexes) {
      if (bRookIndexes[index] > wKingPos) {
        if (ifRookAttacksKing(boardArray, wKingPos, bRookIndexes[index])) {
          return true;
        }
      }
    }

    i = -1;
    bKnightIndexes = [];
    while ((i = boardArray.indexOf("n", i + 1)) !== -1) {
      bKnightIndexes.push(i);
    }
    for (index in bKnightIndexes) {
      if (bKnightIndexes[index] >= 0) {
        if (
          bKnightIndexes[index] > 0 &&
          (bKnightIndexes[index] === wKingPos + 2 ||
            bKnightIndexes[index] === wKingPos - 2)
        ) {
          return true;
        }
      }
    }
  } else {
    i = -1;
    wRookIndexes = [];
    while ((i = boardArray.indexOf("R", i + 1)) !== -1) {
      wRookIndexes.push(i);
    }
    for (index in wRookIndexes) {
      if (bKingPos > wRookIndexes[index]) {
        if (ifRookAttacksKing(boardArray, wRookIndexes[index], bKingPos)) {
          return true;
        }
      }
    }

    i = -1;
    wKnightIndexes = [];
    while ((i = boardArray.indexOf("N", i + 1)) !== -1) {
      wKnightIndexes.push(i);
    }
    for (index in wKnightIndexes) {
      if (wKnightIndexes[index] >= 0) {
        if (
          wKnightIndexes[index] > 0 &&
          (wKnightIndexes[index] === bKingPos + 2 ||
            wKnightIndexes[index] === bKingPos - 2)
        ) {
          return true;
        }
      }
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
    gameResult.hidden = false;
    gameResult.innerText = "Remis przez powtórzenie pozycji";
    resetGameButton.hidden = false;
    backButton.hidden = false;
    backButton.hidden = false;
  }
}

function checkIfEnoughMaterial() {
  if (
    !boardArray.includes("R") &&
    !boardArray.includes("N") &&
    !boardArray.includes("r") &&
    !boardArray.includes("n")
  ) {
    state = States.GAMEOVER;

    gameResult.hidden = false;
    gameResult.innerText = "Remis przez niewystarczający materiał";
    resetGameButton.hidden = false;
    backButton.hidden = false;
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

function setUpCanvas() {
  canvas.id = "canvas";
  canvas.width = boardSize * 100;
  canvas.height = squareSize + 30;

  //canvas.style.zIndex = 8;
  //canvas.style.position = "absolute";
  canvas.style.border = "3px solid";
  canvas.style.borderRadius = "10px";
}

function startGame() {
  setUpCanvas();
  addCanvas();
  setUpGame();
}

function setUpGame() {
  state = States.SELECT;
  whiteMove = true;
  boardArray = defaultBoardArray.slice();
  drawBoard(ctx, null);
  positions = {};
  addPosition();
  gameResult.innerText = "";
  gameResult.hidden = true;
  resetGameButton.hidden = true;
  backButton.hidden = true;
}

function addCanvas() {
  /*let child = boardDiv.lastElementChild;
  if (child) {
    boardDiv.removeChild(child);
  }*/
  ctx = canvas.getContext("2d");
  boardDiv.appendChild(canvas);
}

window.addEventListener("load", function () {
  boardDiv = document.getElementById("board");
  canvas = document.createElement("canvas");
  canvas.addEventListener("mousedown", function (e) {
    if (state === States.SELECT) {
      selectPiece(e);
    } else if (state === States.MOVE) {
      movePiece(e);
    }
  });
  ctx = canvas.getContext("2d");
  gameResult = document.getElementById("gameResult");
  backButton = document.getElementById("backButton");
  resetGameButton = document.getElementById("resetGameButton");
  //startGame();
});
