import "./main.css";

/* @ts-ignore */
if (window.DEBUG) {
	new EventSource("/esbuild").addEventListener("change", () =>
		location.reload(),
	);
}

const grid = document.getElementById("grid");
const scoreDisplay = document.getElementById("score");
const width = 10;

let currentSnake = [2, 1, 0];
let direction = 0;
let nextDirection = 1;
let score = 0;
const intervalTime = 800;
let squares = grid.querySelectorAll("div");
let interval = 0;

function resetGrid() {
	grid.textContent = "";
	for (let i = 0; i < 100; i++) {
		grid.appendChild(document.createElement("div"));
	}
	squares = grid.querySelectorAll("div");
}

function startGame() {
	nextDirection = 1;
	scoreDisplay.innerText = `${score}`;
	currentSnake = [2, 1, 0];
	for (const idx of currentSnake) {
		squares[idx].classList.add("snake");
	}
	randomApple();
	interval = setInterval(stepGame, intervalTime);
}

function stepGame() {
	if (nextDirection !== -direction) direction = nextDirection;
	if (collision()) {
		console.log("YOU HIT SOMETHING");
		clearInterval(interval);
	} else {
		moveSnake();
	}
}

function moveSnake() {
	const tail = currentSnake.pop();
	squares[tail].classList.remove("snake");
	currentSnake.unshift(currentSnake[0] + direction);
	const head = squares[currentSnake[0]];
	head.classList.add("snake");
	// check apple
	if (head.classList.contains("apple")) {
		head.classList.remove("apple");
		score += 1;
		scoreDisplay.innerText = `${score}`;
		currentSnake.push(tail);
		squares[tail].classList.add("snake");
		randomApple();
	}
}

function collision() {
	if (
		(currentSnake[0] + width >= width * width && direction === width) ||
		(currentSnake[0] % width === width - 1 && direction === 1) ||
		(currentSnake[0] % width === 0 && direction === -1) ||
		(currentSnake[0] - width <= 0 && direction === -width) ||
		squares[currentSnake[0] + direction].classList.contains("snake")
	) {
		return true;
	}
	return false;
}

function randomApple() {
	const availableSquares = grid.querySelectorAll(
		'div[class=""], div:not([class])',
	);
	const idx = Math.floor(Math.random() * availableSquares.length);

	availableSquares[idx].classList.add("apple");
}

document.addEventListener("keydown", (event) => {
	if (event.defaultPrevented) {
		return;
	}

	switch (event.key) {
		case "ArrowRight":
			nextDirection = 1;
			break;
		case "ArrowLeft":
			nextDirection = -1;
			break;
		case "ArrowDown":
			nextDirection = width;
			break;
		case "ArrowUp":
			nextDirection = -width;
			break;
	}
});

resetGrid();
startGame();
