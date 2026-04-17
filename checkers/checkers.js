'use strict';

const gameBoard = document.getElementById('game-board');
const playIndication = document.querySelector('.turn-indicator');
const vsHuman = document.getElementById('human');
const welcomeScreen = document.querySelector('.welcome');

// --- SIGNALR STATE ---
let currentBoard = [];
let currentPlayer = 1;
let selectedPiece = null;
let mustJumpPiece = null;

// --- CONNECTION ---
const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5271/gameHub")
    .build();

// Listen for game start
connection.on("GameStarted", (board, player) => {
    updateLocalState(board, player, null);
});

// Listen for move updates
connection.on("MoveMade", (board, player, mJump) => {
    updateLocalState(board, player, mJump);
});

connection.on("InvalidMove", () => alert("That move is not allowed!"));

connection.start().catch(err => console.error(err));

function updateLocalState(board, player, mJump) {
    currentBoard = board;
    currentPlayer = player;
    mustJumpPiece = mJump;
    selectedPiece = null;
    
    ui.draw(currentBoard);
    playIndication.textContent = (currentPlayer === 1 ? "Black" : "White") + "'s Turn";
    if (mustJumpPiece) playIndication.textContent += " (Must Jump!)";
}

// --- UI RENDERER ---
class CheckersUI {
    constructor(boardElement, onSquareClick) {
        this.boardElement = boardElement;
        this.onSquareClick = onSquareClick;
    }

    draw(board) {
        this.boardElement.innerHTML = '';
        board.forEach((row, r) => {
            row.forEach((cell, c) => {
                const square = document.createElement('div');
                square.className = `square ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;
                square.dataset.row = r;
                square.dataset.col = c;
                square.onclick = () => this.onSquareClick(r, c);

                if (cell) {
                    const p = document.createElement('div');
                    p.className = `piece p${cell.player} ${cell.isKing ? 'king' : ''}`;
                    p.textContent = cell.isKing ? '👑' : '';
                    square.appendChild(p);
                }
                this.boardElement.appendChild(square);
            });
        });
    }

    highlight(r, c) {
        const sq = this.boardElement.querySelector(`[data-row="${r}"][data-col="${c}"]`);
        if (sq) sq.classList.add('highlight-move');
    }

    clear() {
        document.querySelectorAll('.highlight-move').forEach(s => s.classList.remove('highlight-move'));
    }
}

const ui = new CheckersUI(gameBoard, (row, col) => {
    const cell = currentBoard[row][col];

    // 1. Select a piece
    if (cell && cell.player === currentPlayer) {
        // Multi-jump enforcement: if mustJumpPiece exists, only that piece can be selected
        if (mustJumpPiece && (row !== mustJumpPiece.row || col !== mustJumpPiece.col)) return;

        ui.clear();
        selectedPiece = { row, col };
        ui.highlight(row, col);
        return;
    }

    // 2. Try to move to a square
    if (selectedPiece) {
        connection.invoke("MakeMove", selectedPiece.row, selectedPiece.col, row, col)
            .catch(err => console.error(err));
        ui.clear();
    }
});

// --- START GAME ---
vsHuman.addEventListener('click', () => {
    welcomeScreen.style.display = 'none';
    gameBoard.style.display = 'grid';
    playIndication.style.display = 'flex';
    
    connection.invoke("StartGame").catch(err => console.error(err));
});