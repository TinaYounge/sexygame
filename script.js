var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var img = document.getElementById("banana");
var imgs = document.getElementById("bananaonthetree");
var imgjum = document.getElementById("jumpoline");
var rightPressed = false,
  leftPressed = false;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
let boxX = 150,
  boxY = 470,
  boxWid = 50,
  boxHig = 50;
let dotX = boxX + boxWid / 2,
  dotY = boxY + boxHig / 2;
let dx = 2,
  dy = 5,
  ballRadius = 5;
let interval = setInterval(draw, 50);
let paddleHeight = 10,
  paddleWidth = 100,
  paddleX = (canvas.width - paddleWidth) / 2;
let brickRowCount = 8,
  brickColumnCount = 4,
  brickOffsetLeft = 1,
  brickPadding = 2;
let brickWidth =
  (300 - (brickColumnCount - 1) * brickPadding - brickOffsetLeft) /
  brickColumnCount;
let brickHeight = 20,
  brickOffsetTop = 130;
let bricks = [];
let score = 0;
let mySound;
mySound = new sound("./sugoi-nya.mp3");

for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (var r = 0; r < brickRowCount; r++) {
    let statusBrick = Math.ceil(Math.random() * 4 + 1);
    // let sounds = Math.floor(Math.random() * 10);
    bricks[c][r] = { x: 0, y: 0, status: statusBrick };
  }
}

function drawBall() {
  ctx.beginPath();
  // ctx.drawImage(
  //   img,
  //   dotX - ballRadius / 2,
  //   dotY - ballRadius / 2,
  //   ballRadius,
  //   ballRadius
  // );
  ctx.arc(dotX, dotY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
  console.log("ball");
}

function drawPaddle() {
  ctx.beginPath();
  // ctx.drawImage(
  //   imgjum,
  //   paddleX,
  //   canvas.height - paddleHeight,
  //   paddleWidth,
  //   paddleHeight
  // );
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#79D5DAC3";
  ctx.fill();
  ctx.closePath();
}

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status != 0) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        switch (bricks[c][r].status) {
          case 1:
            ctx.fillStyle = "#79D5DAC3";

            break;
          case 2:
            ctx.fillStyle = "#FFC300";

            break;
          case 3:
            ctx.fillStyle = "#FF5733";

            break;
          case 4:
            ctx.fillStyle = "#900C3F";

            break;
          case 5:
            ctx.fillStyle = "#581845";
            break;
          default:
            console.log("Sorry, we are out of ");
        }
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}
// Initialize bricks
function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status != 0) {
        if (
          dotX >= b.x &&
          dotX <= b.x + brickWidth &&
          dotY >= b.y &&
          dotY <= b.y + brickHeight
        ) {
          dy = -dy;
          bricks[c][r].status -= 1;
          console.log("colision");
          score++;
          if (score == 3000) {
            alert("YOU WIN, CONGRATS!");
            document.location.reload();
            clearInterval(interval);
          }
        }
        if (b.status == 0) {
          mySound.play();
          // mySound.stop();
        }
      }
    }
  }
}
// Score
function drawScore() {
  ctx.font = "20px solid Arial";
  ctx.fillStyle = "red";
  ctx.fillText("Score: " + score, 10, 30);
}
// sound
function sound(src) {
  console.log("sound");
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  // this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function () {
    this.sound.play();
  };
  this.stop = function () {
    this.sound.pause();
  };
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  collisionDetection();
  // Bouncing off the left and right
  if (dotX + dx > canvas.width - ballRadius || dotX + dx < ballRadius) {
    dx = -dx;
  }
  // bouncing off the top and bottom
  if (dotY + dy < ballRadius) {
    dy = -dy;
  } else if (dotY + dy > canvas.height - ballRadius - paddleHeight) {
    if (dotX > paddleX && dotX < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      alert("Yua Mikami hates you");
      document.location.reload();
      clearInterval(interval);
    }
  }
  if (rightPressed) {
    paddleX += 7;
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  } else if (leftPressed) {
    paddleX -= 7;
    if (paddleX < 0) {
      paddleX = 0;
    }
  }
  dotX += dx;
  dotY += dy;
}
