"use strict";
const gameBoard = document.getElementById('game-board');
const playIndication = document.querySelector('.turn-indicator');
const vsHuman = document.getElementById('human');
const welcomeScreen = document.querySelector('.welcome');

// -------- REFACTORING THE GAME LOGIC FLOW ---------
// 1. THE ENGINE
class CheckersEngine{
    constructor(){
        this.Board_Size = 8;
        this.board = Array.from({length: 8}, () => Array(8).fill(null));
        this.currentPlayer = 2 // white starts
        this.selectedPiece = null;
        this.mustJumpPieece = null; // multi-jump enforcement
    }

    createInitialBoard(){
        for(let row = 0; row < this.Board_Size; row++){
            for(let column = 0; column < this.Board_Size; column++){
                if((row + column) % 2 !== 0){
                    if (row < 3) this.board[row][column] = {player: 1, king: false};
                    else if(row > 4) this.board[row][column] = {player: 2, king: false};
                }
            }
        }
    }

    toggleTurn(){
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.mustJumpPieece = null;
    }
}

// ------- THE RULES OF CHECKERS GAME --------
class MoveValidator{
    static getLegalMoves(engine, row, col){
        const piece = engine.board[row][col];
        if(!piece) return [];
    }

    static isKingPromotion(piece, row){
        return (piece.player === 1 && row === 7) || (piece.player === 2 && row === 0);
    }
}

// ----------- UI RENDERER ------------
class CheckersUI{
    constructor(boardElement, onSquareClick){
        this.boardElement = boardElement;
        this.onSquareClick = onSquareClick;
    }

    draw(boardState){
        this.boardElement.innerHTML = '';
        boardState.forEach((row, r) => {
            row.forEach((cell, c) => {
                const square = this.createSquare(r, c, cell);
                this.boardElement.appendChild(square);
            });
        });
    }

    createSquare(r, c, piece){
        const div = document.createElement('div');
        div.className = `square ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;
        div.onclick = () => this.onSquareClick(r, c);
        if(piece){
            const p = document.createElement('div');
            p.className = `piece p${piece.player} ${piece.king ? 'king' : ''}`;
            p.textContent = piece.king ? '👑' : '';
            div.appendChild(p);
        }
        return div;
    }
}

// ----- THE CONTROLLER UNIT -----
const engine = new CheckersEngine();
const ui = new CheckersUI(document.getElementById('game-board'), (r, c) => {

});

// ------ START GAME BUTTON ------
vsHuman.addEventListener('click', () => {
    welcomeScreen.style.display = 'none';  
    gameBoard.style.display = 'grid';
    playIndication.style.display = 'flex';
    playIndication.textContent = "White's Turn";

    // Game Logic start
    engine.createInitialBoard();
    ui.draw(engine.board);
})
