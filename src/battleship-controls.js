export class Ship {
  constructor(length, type) {
    this.length = length;
    this.timesHit = 0;
    this.isSunk = false;
    this.type = type; // A: 5, B: 4, C: 3, D: 3, E: 2
  }

  hit() {
    this.timesHit = Math.min(this.length, this.timesHit + 1);
    if (this.timesHit == this.length) {
      this.isSunk = true;
    }
  }
}

export class Gameboard {
  constructor(playerNumber) {
    this.board = [
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    ];
    this.ships = [
      new Ship(5, "A"),
      new Ship(4, "B"),
      new Ship(3, "C"),
      new Ship(3, "D"),
      new Ship(2, "E"),
    ];
    this.playerNumber = playerNumber;

    /*
    Sample Board:

    this.board = [
      [".", "A", ".", "B", "B", "B", "B", "B", ".", "."],
      [".", "A", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", "A", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    ]; etc etc etc etc
    X: hit, on fire, O: hit, nothing, .: not hit

    */
  }

  resetBoard() {
    this.board = [
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    ];
  }

  recieveAttack(x, y) {
    if (!["X", "O", "."].includes(this.board[x][y])) {
      const letter = this.board[x][y];
      const shipNum = letter.charCodeAt(0) - "A".charCodeAt(0);
      this.ships[shipNum].hit();

      this.board[x][y] = "X";
    } else if (this.board[x][y] === ".") {
      this.board[x][y] = "O";
    } else {
      return false;
    }
    return true;
  }

  allSunk() {
    for (const s of this.ships) {
      if (s.isSunk === false) return false;
    }

    return true;
  }

  genRandBoard() {
    // start with highest to least (less chance of overlap, may be faster...)
    // randomly select an origin square, direction, then try to place that way. If fails, then re-try until works

    const dx = [-1, 1, 0, 0];
    const dy = [0, 0, -1, 1];

    const shipLengths = [5, 4, 3, 3, 2];
    const shipTypes = ["A", "B", "C", "D", "E"];

    for (let i = 0; i < 5; i++) {
      const length = shipLengths[i];
      while (true) {
        const originX = Math.floor(Math.random() * 10);
        const originY = Math.floor(Math.random() * 10);
        const randDir = Math.floor(Math.random() * 4);
        let works = true;

        for (let j = 0; j < length; j++) {
          const nx = originX + dx[randDir] * j;
          const ny = originY + dy[randDir] * j;
          if (
            !(
              nx >= 0 &&
              nx < 10 &&
              ny >= 0 &&
              ny < 10 &&
              this.board[nx][ny] === "."
            )
          )
            works = false;
        }

        if (works) {
          for (let j = 0; j < length; j++) {
            const nx = originX + dx[randDir] * j;
            const ny = originY + dy[randDir] * j;
            this.board[nx][ny] = shipTypes[i];
          }
          break;
        } // else keeps trying
      }
    }
  }

  displayBoard() {
    // 1 or 2
    // const boardElement = document.querySelector(".board-1") or ....(".board-2")
    const tiles = document.querySelectorAll(`.board-${this.playerNumber}-tile`);
    let index = 0;
    tiles.forEach((tile) => {
      tile.className = "";
      const x = Math.floor(index / 10),
        y = index % 10;
      const boardString = this.board[x][y];
      tile.classList.add("tile", `board-${this.playerNumber}-tile`);
      tile.id = String(index);
      if (boardString !== ".") tile.classList.add(`ship-${boardString}`);
      index++;
    });
  }

  removeShipColors() {
    // 1 or 2
    // const boardElement = document.querySelector(".board-1") or ....(".board-2")
    const tiles = document.querySelectorAll(`.board-${this.playerNumber}-tile`);
    let index = 0;
    tiles.forEach((tile) => {
      tile.className = "";
      const boardString = this.board[Math.floor(index / 10)][index % 10];
      tile.classList.add("tile", `board-${this.playerNumber}-tile`);

      if (boardString !== ".") tile.classList.remove(`ship-${boardString}`);
      index++;
    });
  }

  async waitForAttack() {
    const tiles = document.querySelectorAll(`.board-${this.playerNumber}-tile`);
    return new Promise((resolve) => {
      const onClick = (e) => {
        const tile = e.currentTarget;
        const index = Number(tile.id);
        const x = Math.floor(index / 10),
          y = index % 10;
        if (this.recieveAttack(x, y)) {
          tile.classList.add("less-opaque-tiles");
          tiles.forEach((t) => t.removeEventListener("click", onClick));
          // console.log(this.board[x][y] === "X");
          resolve(this.board[x][y] === "X");
        } else {
          return;
        }
      };
      tiles.forEach((t) => t.addEventListener("click", onClick));
    });
  }
}

export class Player {
  constructor(playerName) {
    this.board = new Gameboard(playerName === "Player 1" ? 1 : 2);
  }
}
