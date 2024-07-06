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
let direction = 1;
const score = 0;
const intervalTime = 1000;
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
	//TODO add apple
	direction = 1;
	scoreDisplay.innerText = `${score}`;
	currentSnake = [2, 1, 0];
	for (const idx of currentSnake) {
		squares[idx].classList.add("snake");
	}
	interval = setInterval(stepGame, intervalTime);
}

function stepGame() {
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
	squares[currentSnake[0]].classList.add("snake");
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

document.addEventListener("keydown", (event) => {
	if (event.defaultPrevented) {
		return;
	}

	switch (event.key) {
		case "ArrowRight":
			if (direction !== -1) direction = 1;
			break;
		case "ArrowLeft":
			if (direction !== 1) direction = -1;
			break;
		case "ArrowDown":
			if (direction !== -width) direction = width;
			break;
		case "ArrowUp":
			if (direction !== width) direction = -width;
			break;
	}
});

resetGrid();
startGame();
