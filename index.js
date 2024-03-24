// Dom
const gameEl = document.querySelector("[data-game]");

// Data
let GRID = 27;
let delay = 300;
let score = 0;
let snakeDirection = "";
let snakeBodies = [{ x: 14, y: 14 }];
let currentPos = {
  x: snakeBodies[0].x,
  y: snakeBodies[0].y,
};
let food = randomFood();

// Expression funcs
const init = () => {
  drawScore(score);
  drawFood(food);
  drawSnake(snakeBodies);
  refresh();
};

const refresh = () => {
  clear();

  drawScore(score);
  drawFood(food);
  drawSnake(snakeBodies);
  forwardSnake(snakeDirection);
  const game = setTimeout(refresh, delay);

  if (hitWall(currentPos)) {
    console.log("GAME OVER: snake collides wall");
    clearTimeout(game);
    setTimeout(replay, 1000);
    return;
  }

  // Check if snake is eating food
  if (snakeIsEatingFood(currentPos, food)) {
    score++;

    snakeBodies = [...snakeBodies, currentPos];
    food = randomFood();

    delay = speedUp(delay);
    console.log(delay);
    return;
  }

  // Check if snake collides itself
  const rest = snakeBodies.slice(1);
  for (let i = 0; i < rest.length; i++) {
    if (
      snakeDirection !== "" &&
      snakeBodies[0].x === rest[i].x &&
      snakeBodies[0].y === rest[i].y
    ) {
      console.log("GAME OVER: snake collides itself");
      clearTimeout(game);
      setTimeout(replay, 1000);
      return;
    }
  }
};

const drawScore = (score) => {
  const scoreEl = document.createElement("div");
  scoreEl.classList.add("score");

  if (score === 0) {
    scoreEl.style.fontSize = "1rem";
    scoreEl.innerHTML = `PRESS CONTROL KEYS, &#8592;&#8593;&#x2193;&#8594;`;
  } else {
    scoreEl.textContent = score;
  }

  gameEl.appendChild(scoreEl);
};

const drawFood = (food) => {
  const foodEl = document.createElement("div");
  foodEl.classList.add("food");
  foodEl.style.gridColumnStart = food.x;
  foodEl.style.gridRowStart = food.y;
  gameEl.appendChild(foodEl);
};

const drawSnake = (snakeBodies) => {
  snakeBodies.forEach((sb) => {
    const snakeEl = document.createElement("div");
    snakeEl.classList.add("snake");

    if (sb.x === currentPos.x && sb.y === currentPos.y) {
      snakeEl.style.backgroundColor = "crimson";
    }

    snakeEl.style.gridColumnStart = sb.x;
    snakeEl.style.gridRowStart = sb.y;
    gameEl.appendChild(snakeEl);
  });
};

const forwardSnake = (direction) => {
  switch (direction) {
    case "up":
      currentPos = {
        x: snakeBodies[0].x,
        y: snakeBodies[0].y - 1,
      };
      break;
    case "down":
      currentPos = {
        x: snakeBodies[0].x,
        y: snakeBodies[0].y + 1,
      };
      break;
    case "left":
      currentPos = {
        x: snakeBodies[0].x - 1,
        y: snakeBodies[0].y,
      };
      break;
    case "right":
      currentPos = {
        x: snakeBodies[0].x + 1,
        y: snakeBodies[0].y,
      };
      break;
    default:
  }

  snakeBodies.unshift(currentPos);
  snakeBodies.pop();
};

const handleKeyDown = (e) => {
  switch (e.code) {
    case "ArrowRight":
      if (snakeDirection === "left") return;
      snakeDirection = "right";
      break;
    case "ArrowLeft":
      if (snakeDirection === "right") return;
      snakeDirection = "left";
      break;
    case "ArrowUp":
      if (snakeDirection === "down") return;
      snakeDirection = "up";
      break;
    case "ArrowDown":
      if (snakeDirection === "up") return;
      snakeDirection = "down";
      break;
    default:
  }
};

// Declaration funcs
function randomFood() {
  return {
    x: Math.floor(Math.random() * GRID) + 1,
    y: Math.floor(Math.random() * GRID) + 1,
  };
}

function hitWall(currentPos) {
  if (
    currentPos.x < 1 ||
    currentPos.x > GRID ||
    currentPos.y < 1 ||
    currentPos.y > GRID
  ) {
    return true;
  }
}

function speedUp(delay) {
  return Math.round((delay -= delay / GRID));
}

function snakeIsEatingFood(currentPos, food) {
  return currentPos.x === food.x && currentPos.y === food.y;
}

function clear() {
  gameEl.innerHTML = "";
}

function replay() {
  if (confirm("Game Over, Press OK to restart !")) {
    location.replace("/projects/snake_2024");
  }
}

// Init
init();
document.addEventListener("keydown", handleKeyDown);
