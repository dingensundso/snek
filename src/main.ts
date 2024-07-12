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

document.addEventListener("scoreUpdate", (event: CustomEvent) => {
	scoreDisplay.innerText = event.detail;
});

const game = new SnakeGame();
games_div.appendChild(game.dom);
