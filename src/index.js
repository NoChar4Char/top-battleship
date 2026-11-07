import { Ship, Gameboard, Player } from "./battleship-controls.js";

const randomizeBoardButton1 = document.querySelector(".randomize-1");
const resetBoardButton1 = document.querySelector(".reset-1");
const confirmBoardButton1 = document.querySelector(".confirm-1");
const randomizeBoardButton2 = document.querySelector(".randomize-2");
const resetBoardButton2 = document.querySelector(".reset-2");
const confirmBoardButton2 = document.querySelector(".confirm-2");
const gameGuide = document.querySelector(".game-guide");

const player1 = new Player("Player 1");
const player2 = new Player("Player 2");

randomizeBoardButton1?.addEventListener("click", () => {
  player1.board.resetBoard();
  player1.board.genRandBoard();
  player1.board.displayBoard();
  resetBoardButton1.disabled = false;
  confirmBoardButton1.disabled = false;
});

resetBoardButton1?.addEventListener("click", () => {
  player1.board.resetBoard();
  player1.board.displayBoard();
  resetBoardButton1.disabled = true;
  confirmBoardButton1.disabled = true;
});

confirmBoardButton1?.addEventListener("click", () => {
  randomizeBoardButton2.disabled = false;
  randomizeBoardButton1.disabled = true;
  resetBoardButton1.disabled = true;
  confirmBoardButton1.disabled = true;

  player1.board.removeShipColors();
  gameGuide.textContent = "Player 2 places ships, player 1 leaves";
});

randomizeBoardButton2?.addEventListener("click", () => {
  player2.board.resetBoard();
  player2.board.genRandBoard();
  player2.board.displayBoard();
  resetBoardButton2.disabled = false;
  confirmBoardButton2.disabled = false;
});

resetBoardButton2?.addEventListener("click", () => {
  player2.board.resetBoard();
  player2.board.displayBoard();
  resetBoardButton2.disabled = true;
  confirmBoardButton2.disabled = true;
});

confirmBoardButton2?.addEventListener("click", () => {
  randomizeBoardButton2.disabled = true;
  resetBoardButton2.disabled = true;
  confirmBoardButton2.disabled = true;

  player2.board.removeShipColors();
  document.documentElement.style.setProperty(
    "--missle-cursor",
    "url('../imgs/missle-32.png'), auto",
  );

  document.documentElement.style.setProperty("--blacked", "true");
  player1.board.displayBoard();
  player2.board.displayBoard();
  gameGuide.textContent = "Player 1's turn";

  playGame();
});

(() => {
  const boardElementOne = document.querySelector(".board-1");
  const boardElementTwo = document.querySelector(".board-2");
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const newDivOne = document.createElement("div");
      newDivOne.classList.add("tile", "board-1-tile");
      boardElementOne?.appendChild(newDivOne);

      const newDivTwo = document.createElement("div");
      newDivTwo.classList.add("tile", "board-2-tile");
      boardElementTwo?.appendChild(newDivTwo);
    }
  }
})();

async function playGame() {
  let turn = 1; // that means by default, player 2 is getting BR'd
  while (true) {
    let sameTurn = false;
    if (turn === 1) {
      sameTurn = await player2.board.waitForAttack();
      if (player2.board.allSunk()) {
        ("Player 1 Wins!!!");
        return 1;
      }
    } else {
      sameTurn = await player1.board.waitForAttack();
      if (player1.board.allSunk()) {
        ("Player 2 Wins!!!");
        return 2;
      }
    }
    if (!sameTurn) turn = (turn % 2) + 1;
    gameGuide.textContent = `Player ${turn}'s turn`;
  }
}
