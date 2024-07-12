import "./main.css";
import { SnakeGame } from "./game";

/* @ts-ignore */
if (window.DEBUG) {
	new EventSource("/esbuild").addEventListener("change", () =>
		location.reload(),
	);
}

const games_div = document.getElementById("games");
const scoreDisplay = document.getElementById("score");

let applesEaten = 0;
let score = 0;
let intervalTime = 250;
let gamesSpawned = 0;
const maxGames = 25;

function addGame() {
	const game = new SnakeGame(intervalTime);
	game.dom.style["min-width"] = 0;
	game.dom.style.flex = "0";
	games_div.appendChild(game.dom);
	setTimeout(() => {
		game.dom.style["min-width"] = null;
		game.dom.style.flex = null;
	}, 10);
	gamesSpawned++;
}

document.addEventListener("gameOver", (event: CustomEvent) => {
	const game = event.target as HTMLElement;
	const snake_length = game.querySelectorAll(".snake").length;
	score -= Math.floor(snake_length / 2);
	scoreDisplay.innerText = `${score}`;
	game.style["min-width"] = 0;
	game.style.flex = "0";
	setTimeout(() => {
		games_div.removeChild(game);
		if (games_div.children.length === 0) {
			const el = document.createElement("h1");
			el.innerText = "YOU LOST!";
			games_div.appendChild(el);
		}
	}, 500);
});

document.addEventListener("scoreUpdate", (event: CustomEvent) => {
	const numGames = games_div.querySelectorAll(".grid").length;
	applesEaten += 1;
	score += numGames;
	scoreDisplay.innerText = `${score}`;
	if (applesEaten % 3 === 0) {
		if (gamesSpawned < maxGames) {
			addGame();
		}
		if (intervalTime > 50) {
			intervalTime -= 10;
			games_div.dispatchEvent(
				new CustomEvent("speedChange", { detail: intervalTime, bubbles: true }),
			);
		}
	}
});

addGame();
