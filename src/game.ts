export { SnakeGame };

class SnakeGame {
	width = 10;
	currentSnake = [42, 41, 40];
	direction = 0;
	nextDirection = 1;
	score = 0;
	intervalTime = 250;
	interval = 0;
	dom: HTMLElement;
	squares: NodeListOf<HTMLElement>;

	constructor(width = 10) {
		this.width = width;
		this.dom = document.createElement("div");
		this.dom.classList.add("grid");

		for (let i = 0; i < 100; i++) {
			this.dom.appendChild(document.createElement("div"));
		}
		this.squares = this.dom.querySelectorAll("div");
		this.startGame();
	}
	startGame() {
		document.addEventListener("keydown", (event) => {
			if (event.defaultPrevented) {
				return;
			}

			switch (event.key) {
				case "ArrowRight":
					this.nextDirection = 1;
					break;
				case "ArrowLeft":
					this.nextDirection = -1;
					break;
				case "ArrowDown":
					this.nextDirection = this.width;
					break;
				case "ArrowUp":
					this.nextDirection = -this.width;
					break;
			}
		});
		for (const idx of this.currentSnake) {
			this.squares[idx].classList.add("snake");
		}
		this.randomApple();
		this.interval = setInterval(this.stepGame.bind(this), this.intervalTime);
	}

	stepGame() {
		if (this.direction % 9 === 0) {
			this.direction = -(this.direction / 9);
		}
		if (this.nextDirection !== -this.direction) {
			this.direction = this.nextDirection;
		}
		if (this.collision) {
			this.gameOver();
		} else {
			this.moveSnake();
		}
	}

	moveSnake() {
		const tail = this.currentSnake.pop();
		this.squares[tail].classList.remove("snake");
		this.currentSnake.unshift(this.currentSnake[0] + this.direction);
		const head = this.squares[this.currentSnake[0]];
		head.classList.add("snake");
		// check apple
		if (head.classList.contains("apple")) {
			head.classList.remove("apple");
			this.score += 1;
			this.dom.dispatchEvent(
				new CustomEvent("scoreUpdate", { detail: this.score, bubbles: true }),
			);
			this.currentSnake.push(tail);
			this.squares[tail].classList.add("snake");
			this.randomApple();
		}
	}

	get collision() {
		if (
			this.currentSnake[0] + this.width >= this.width * this.width &&
			this.direction === this.width
		) {
			// bottom
			this.direction = -this.width * (this.width - 1);
		}
		if (
			this.currentSnake[0] % this.width === this.width - 1 &&
			this.direction === 1
		) {
			// right
			this.direction = -(this.width - 1);
		}
		if (this.currentSnake[0] % this.width === 0 && this.direction === -1) {
			// left
			this.direction = +(this.width - 1);
		}
		if (
			this.currentSnake[0] - this.width <= 0 &&
			this.direction === -this.width
		) {
			// up
			this.direction = +this.width * (this.width - 1);
		}
		if (
			this.squares[this.currentSnake[0] + this.direction].classList.contains(
				"snake",
			)
		) {
			return true;
		}
		return false;
	}

	randomApple() {
		const availableSquares = this.dom.querySelectorAll(
			'div[class=""], div:not([class])',
		);
		const idx = Math.floor(Math.random() * availableSquares.length);

		availableSquares[idx].classList.add("apple");
	}

	gameOver() {
		clearInterval(this.interval);
		const popup = document.createElement("div");
		popup.classList.add("popup");
		const popupText = document.createElement("span");
		popupText.innerText = "GAME OVER";
		popup.appendChild(popupText);
		this.dom.insertBefore(popup, this.dom.children[0]);
		this.dom.dispatchEvent(new CustomEvent("gameOver", { bubbles: true }));
	}
}
