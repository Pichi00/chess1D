let boardDiv, canvas, ctx;
const boardSize = 8;
const squareSize = 100;
const defaultBoardArray = ["K", "N", "R", "0", "0", "r", "n", "k"];
let boardArray = defaultBoardArray;

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

function drawBoard(ctx) {
  let lightColor = "#F0D9B5";
  let darkColor = "#B58863";
  let pieces = getImagesfromDom();

  ctx.fillStyle = "#4a433e";
  ctx.fillRect(0, 100, boardSize * squareSize, 30);
  // draw board
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
  /*ctx.fillStyle = darkColor;
  ctx.fillRect(0, 0, 100, 100);
  ctx.fillRect(200, 0, 100, 100);
  ctx.fillRect(400, 0, 100, 100);
  ctx.fillRect(600, 0, 100, 100);
  ctx.fillRect(800, 0, 100, 100);

  ctx.fillStyle = lightColor;
  ctx.fillRect(100, 0, 100, 100);
  ctx.fillRect(300, 0, 100, 100);
  ctx.fillRect(500, 0, 100, 100);
  ctx.fillRect(700, 0, 100, 100);*/
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

function setUpCanvas(cnv, ctx) {
  cnv.id = "canvas";
  cnv.width = boardSize * 100;
  cnv.height = squareSize + 30;

  cnv.style.zIndex = 8;
  cnv.style.position = "absolute";
  cnv.style.border = "1px solid";

  //ctx.fillStyle = currentBg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener("load", function () {
  boardDiv = document.getElementById("board");
  canvas = document.createElement("canvas");
  ctx = canvas.getContext("2d");
  setUpCanvas(canvas, ctx);
  boardDiv.appendChild(canvas);
  drawBoard(ctx);
});
