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

function gameOver(game) {
	const snake_length = game.querySelectorAll(".snake").length;
	score -= Math.floor(snake_length / 2);
	scoreDisplay.innerText = `${score}`;
	games_div.removeChild(game);
	if (games_div.children.length === 0) {
		const el = document.createElement("h1");
		el.innerText = "YOU LOST!";
		games_div.appendChild(el);
	}
}

document.addEventListener("gameOver", (event: CustomEvent) => {
	setTimeout(() => gameOver(event.target), 500);
});

document.addEventListener("scoreUpdate", (event: CustomEvent) => {
	const numGames = games_div.querySelectorAll(".grid").length;
	applesEaten += 1;
	score += numGames;
	scoreDisplay.innerText = `${score}`;
	if (applesEaten % 3 === 0) {
		games_div.appendChild(new SnakeGame().dom);
	}
});

games_div.appendChild(new SnakeGame().dom);
