// Dom
const gameEl = document.querySelector("[data-game]");

// Data
let GRID = 27;
let delay = 300;
let score = 0;
let maxScore = 30;
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
let game;

// Expression funcs
const init = () => {
  drawScore(score);
  drawFood(food);
  drawSnake(snakeBodies);
};

const refresh = () => {
  clear();

  drawScore(score);
  drawFood(food);
  drawSnake(snakeBodies);
  forwardSnake(snakeDirection);
  game = setTimeout(refresh, delay);

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

    for (let i = 0; i < snakeBodies.length; i++) {
      if (food.x === snakeBodies[i].x && food.y === snakeBodies[i].y) {
        food = randomFood();
      }
    }

    delay = speedUp(delay);
    return;
  }

  // Check if snake collides itself
  const rest = snakeBodies.slice(1);
  for (let i = 0; i < rest.length; i++) {
    if (
      snakeBodies.length > 3 &&
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

  if (score >= maxScore) {
    document.querySelector(".score").style.fontSize = "1.5rem";
    document.querySelector(".score").textContent = `BRAVO, YOU ARE WINNER !`;
    clearTimeout(game);
    setTimeout(replay, 1000);
    return;
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
  snakeBodies.forEach((sb, i) => {
    const snakeEl = document.createElement("div");
    snakeEl.classList.add("snake");

    if (sb.x === currentPos.x && sb.y === currentPos.y) {
      snakeEl.style.backgroundColor = "crimson";
      snakeEl.style.borderRadius = "0.5rem";
    }

    snakeEl.style.gridColumnStart = sb.x;
    snakeEl.style.gridRowStart = sb.y;
    gameEl.appendChild(snakeEl);
  });
};

const forwardSnake = (direction) => {
  clearTimeout(game);

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
      // If snake turn left for the first load
      if (snakeBodies.length === 3 && snakeBodies[2].x === 13) {
        alert(
          `Snake's direction must be "right, up or down" on a first load !`
        );
        return;
      }

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

  game = setTimeout(refresh, delay);
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
  if (
    confirm(
      `${
        score === maxScore
          ? "Bravo, Press OK to restart !"
          : "Game Over, Press OK to restart !"
      }`
    )
  ) {
    location.replace(location.pathname);
  }
}

// Init
init();
document.addEventListener("keydown", handleKeyDown);
