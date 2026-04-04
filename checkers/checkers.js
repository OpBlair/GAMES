"use strict";
const gameBoard = document.getElementById('game-board');
const playIndication = document.querySelector('.turn-indicator');
const vsHuman = document.getElementById('human');
const welcomeScreen = document.querySelector('.welcome');

let engine;


// 1. THE ENGINE
class CheckersEngine{
    constructor(){
        this.Board_Size = 8;
        this.board = Array.from({length: 8}, () => Array(8).fill(null));
        this.currentPlayer = 1 // Black starts
        this.selectedPiece = null;
        this.mustJumpPiece = null; // multi-jump enforcement
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

    executeMove(fromRow, fromCol, move){
        const piece = this.board[fromRow][fromCol];

        if(!piece) return false;

        const {toRow, toCol, jump, attackRow, attackCol} = move;
        // remove jumped piece
        if(jump){ this.board[attackRow][attackCol] = null; }

        // move piece
        this.board[fromRow][fromCol] = null;
        this.board[toRow][toCol] = piece;

        // promotion
        if(CheckersRules.isKingPromotion(piece, toRow)){ piece.king = true; }

        // multi Jump
        if(jump && CheckersRules.canJumpAgain(this, toRow, toCol)){
            this.mustJumpPiece = {row: toRow, col: toCol};
        }else{
            this.toggleTurn();
        }
        return true;
    }
    toggleTurn(){
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.mustJumpPiece = null;
    }
}

// ------- THE RULES OF CHECKERS GAME --------
class CheckersRules{

    static move_directions = {
        p1: [[1,-1], [1,1]],
        p2: [[-1,-1], [-1,1]],
        king: [[-1,-1], [-1,1], [1,-1], [1,1]]
    }

    static jump_directions = {
        p1: [[2,-2], [2,2]],
        p2: [[-2,-2], [-2,2]],
        king: [[-2,-2], [-2,2], [2,-2], [2,2]]
    }
    
    static generateNormalMoves(engine, row, col){
        const piece = engine.board[row][col];
        if(!piece) return [];

        const moves = [];
        const directions = piece.king ? this.move_directions.king : (piece.player === 1 ? this.move_directions.p1 : this.move_directions.p2);

        for(const[dRow, dCol] of directions){
            const newRow = row + dRow;
            const newCol = col + dCol;

            if(newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) continue;
            if(engine.board[newRow][newCol] !== null) continue;
            moves.push({toRow: newRow, toCol: newCol, jump: false});
        }
        return moves;
    }

    static generateJumpMoves(engine, row, col){
        const piece = engine.board[row][col];
        if(!piece) return [];

        const moves = [];
        const directions = piece.king ? this.jump_directions.king : (piece.player === 1 ? this.jump_directions.p1 : this.jump_directions.p2);

        for(const[dRow, dCol] of directions){
            const newRow = row + dRow;
            const newCol = col + dCol;

            if(newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) continue;
            if(engine.board[newRow][newCol] !== null) continue;

            const midRow = row + dRow / 2;
            const midCol = col + dCol / 2;
            const midPiece = engine.board[midRow][midCol];
            if(midPiece && midPiece.player !== piece.player){
                moves.push({
                    toRow: newRow,
                    toCol: newCol,
                    jump: true,
                    attackRow: midRow,
                    attackCol: midCol
                });
            };
        }
        return moves;
    }

    static generateMoves(engine, row, col){
        const jumpMoves = this.generateJumpMoves(engine, row, col);
        if(jumpMoves.length > 0) return jumpMoves;

        return this.generateNormalMoves(engine, row, col);
    }

    static getLegalMoves(engine, row, col){
        const jumpMoves = this.generateJumpMoves(engine, row, col);

        // if player must jump, only allow jumps
        if(this.playerHasJump(engine, engine.currentPlayer)){
            return jumpMoves;
        }

        // Allow normal moves
        if(jumpMoves.length > 0) return jumpMoves;

        return this.generateNormalMoves(engine, row, col);
    }
    
    static canJumpAgain(engine, row, col){
        const jumps = this.generateJumpMoves(engine, row, col);
        return jumps.length > 0;
    }
    
    static playerHasJump(engine, player){
        for(let row = 0; row < 8; row++){
            for(let col = 0; col < 8; col++){
                const piece = engine.board[row][col];
                if(piece && piece.player === player){
                    if(this.canJumpAgain(engine, row, col)) return true;
                }
            }
        }
        return false;
    }
}


vsHuman.addEventListener('click', () => {
    gameBoard.style.display = 'grid';
    welcomeScreen.style.display = 'none';

    startGame();
})

// Function to Start the Game.
function startGame(){
    engine = new CheckersEngine();
    engine.createInitialBoard();

    renderBoard();
}
