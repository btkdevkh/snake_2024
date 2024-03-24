// Dom
const gameEl = document.querySelector("[data-game]");

// Data
let GRID = 27;
let score = 0;
let snakeDirection = "";
let snakeBodies = [
  { x: 15, y: 14 },
  { x: 14, y: 14 },
  { x: 13, y: 14 },
];
let currentPos = {
  x: snakeBodies[0].x,
  y: snakeBodies[0].y,
};
let food = randomFood();

// Expression funcs
const init = () => {
  clear();
  refresh();
};

const refresh = () => {
  clear();

  drawFood(food);
  drawSnake(snakeBodies);
  if (snakeDirection !== "") {
    forwardSnake(snakeDirection);
  }
  drawScore(score);
  const game = setTimeout(refresh, 300);

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

const hitWall = (currentPos) => {
  if (
    currentPos.x < 1 ||
    currentPos.x > GRID ||
    currentPos.y < 1 ||
    currentPos.y > GRID
  ) {
    return true;
  }
};

const drawScore = (score) => {
  const scoreEl = document.createElement("div");
  scoreEl.classList.add("score");

  if (score === 0) {
    scoreEl.style.fontSize = "1rem";
    scoreEl.innerHTML = `PRESS CONTROL KEYS, "&#8592;&#8593;&#x2193;&#8594;"`;
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
  snakeBodies.forEach((sb, idx) => {
    const snakeEl = document.createElement("div");

    if (idx === 0) {
      snakeEl.style.backgroundColor = "crimson";
    }

    snakeEl.classList.add("snake");
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
