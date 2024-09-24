const grid = document.querySelector('.grid');
const startBtn = document.getElementById('start-btn');
const scoreDisplay = document.getElementById('score');
const blockWidth = 100;
const blockHeight = 20;
const boardWidth = 560;
const boardHeight = 300;
const ballDiameter = 20;

const userStart = [230, 10];
let currentPosition = userStart;

const ballStart = [270, 40];
let ballCurrentPosition = ballStart;

let timerId;
let xDirection = -2;
let yDirection = 2;
let score = 0;
let gameInProgress = false;

class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topLeft = [xAxis, yAxis + blockHeight];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
  }
}

const blocks = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),
  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),
  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),
];

function addBlocks() {
  blocks.forEach(block => {
    const blockElement = document.createElement('div');
    blockElement.classList.add('block');
    blockElement.style.left = block.bottomLeft[0] + 'px';
    blockElement.style.bottom = block.bottomLeft[1] + 'px';
    grid.appendChild(blockElement);
  });
}

function drawUser() {
  user.style.left = currentPosition[0] + 'px';
  user.style.bottom = currentPosition[1] + 'px';
}

function drawBall() {
  ball.style.left = ballCurrentPosition[0] + 'px';
  ball.style.bottom = ballCurrentPosition[1] + 'px';
}

function moveUser(e) {
  if (!gameInProgress) return;
  switch (e.key) {
    case 'ArrowLeft':
      if (currentPosition[0] > 0) {
        currentPosition[0] -= 10;
        drawUser();
      }
      break;
    case 'ArrowRight':
      if (currentPosition[0] < boardWidth - blockWidth) {
        currentPosition[0] += 10;
        drawUser();
      }
      break;
  }
}

document.addEventListener('keydown', moveUser);

const user = document.createElement('div');
user.classList.add('user');
drawUser();
grid.appendChild(user);

const ball = document.createElement('div');
ball.classList.add('ball');
drawBall();
grid.appendChild(ball);

function moveBall() {
  ballCurrentPosition[0] += xDirection;
  ballCurrentPosition[1] += yDirection;
  drawBall();
  checkForCollisions();
}

function checkForCollisions() {
  // Handle collisions with blocks, paddle, walls
  blocks.forEach((block, i) => {
    if (
      ballCurrentPosition[0] > block.bottomLeft[0] &&
      ballCurrentPosition[0] < block.bottomRight[0] &&
      ballCurrentPosition[1] + ballDiameter > block.bottomLeft[1] &&
      ballCurrentPosition[1] < block.topLeft[1]
    ) {
      const allBlocks = Array.from(document.querySelectorAll('.block'));
      allBlocks[i].classList.remove('block');
      blocks.splice(i, 1);
      changeDirection();
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
      if (blocks.length === 0) {
        scoreDisplay.textContent = 'You Win!';
        clearInterval(timerId);
        gameInProgress = false;
      }
    }
  });

  // Paddle collision
  if (
    ballCurrentPosition[0] > currentPosition[0] &&
    ballCurrentPosition[0] < currentPosition[0] + blockWidth &&
    ballCurrentPosition[1] > currentPosition[1] &&
    ballCurrentPosition[1] < currentPosition[1] + blockHeight
  ) {
    changeDirection();
  }

  // Wall collisions
  if (
    ballCurrentPosition[0] >= boardWidth - ballDiameter ||
    ballCurrentPosition[0] <= 0 ||
    ballCurrentPosition[1] >= boardHeight - ballDiameter
  ) {
    changeDirection();
  }

  // Bottom collision (lose)
  if (ballCurrentPosition[1] <= 0) {
    clearInterval(timerId);
    scoreDisplay.textContent = 'You Lose';
    gameInProgress = false;
  }
}

function changeDirection() {
  if (xDirection === 2 && yDirection === 2) {
    yDirection = -2;
  } else if (xDirection === 2 && yDirection === -2) {
    xDirection = -2;
  } else if (xDirection === -2 && yDirection === -2) {
    yDirection = 2;
  } else if (xDirection === -2 && yDirection === 2) {
    xDirection = 2;
  }
}

function startGame() {
  if (!gameInProgress) {
    timerId = setInterval(moveBall, 30);
    gameInProgress = true;
  }
}
startBtn.addEventListener('click', startGame);
addBlocks();
