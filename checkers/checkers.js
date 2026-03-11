"use strict";
const gameBoard = document.getElementById('game-board');
const playIndication = document.querySelector('.turn-indicator');
const vsHuman = document.getElementById('human');
const welcomeScreen = document.querySelector('.welcome');

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
    
    static pieceHasMove(engine, row, col){
        return this.getLegalMoves(engine, row, col).length > 0;
    }
    
    static playerHasAnyMove(engine, player){
        for(let row = 0; row < 8; row++){
            for(let col = 0; col < 8; col++){
                const piece = engine.board[row][col];
                if(piece && piece.player === player){
                    if(this.pieceHasMove(engine, row, col)) return true;
                }
            }
        }
        return false;
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
        div.dataset.row = r;
        div.dataset.col = c;

        div.onclick = () => this.onSquareClick(r, c);
        if(piece){
            const p = document.createElement('div');
            p.className = `piece p${piece.player} ${piece.king ? 'king' : ''}`;
            p.textContent = piece.king ? '👑' : '';
            div.appendChild(p);
        }
        return div;
    }

    highlightMoves(moves){
        moves.forEach(move => {
            const square = this.getSquare(move.toRow, move.toCol);

            if(move.jump){
                square.classList.add("highlight-jump");

                const enemy = this.getSquare(move.attackRow, move.attackCol).querySelector(".piece");

                if(enemy) enemy.classList.add("attackable");
            }else{
                square.classList.add("highlight-move");
            }
        });
    }

    clearHightlights(){
        document.querySelectorAll('.highlight-move, .highlight-jump, .attackable').forEach(
            highlight => {highlight.classList.remove('highlight-move', 'highlight-jump', 'attackable');}
        );
    }

    getSquare(row, col){
        return this.boardElement.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    }
}

// ----- THE CONTROLLER UNIT -----
const engine = new CheckersEngine();

const ui = new CheckersUI(gameBoard, (row, col) => {
    const piece = engine.board[row][col];

    // Multi-jump
    if(engine.mustJumpPiece){
        engine.selectedPiece = {...engine.mustJumpPiece};
    }
    else if(!engine.mustJumpPiece && piece && piece.player === engine.currentPlayer){
        engine.selectedPiece = {row, col};

        const moves = CheckersRules.getLegalMoves(engine, row, col);

        ui.clearHightlights();
        ui.highlightMoves(moves);
    }

    if(engine.selectedPiece){
        const {row: fromRow, col: fromCol} = engine.selectedPiece;
        const moves = CheckersRules.getLegalMoves(engine, fromRow, fromCol);
        const move = moves.find(m => m.toRow === row && m.toCol === col);

        if(move){
            engine.executeMove(fromRow, fromCol, move);
            ui.clearHightlights();
            ui.draw(engine.board);
            
            if(engine.mustJumpPiece){
                engine.selectedPiece = {...engine.mustJumpPiece};
                const moves = CheckersRules.getLegalMoves(engine, engine.mustJumpPiece.row, engine.mustJumpPiece.col);
                ui.highlightMoves(moves);
            }else{
                engine.selectedPiece = null;
            }

            playIndication.textContent = engine.currentPlayer === 2 ? "White's Turn" : "Black's Turn";
            if (engine.mustJumpPiece) playIndication.textContent += "(Must Jump Again!)";
            checkGameOver();
        }
    }

    function checkGameOver(){
        const player = engine.currentPlayer;
        const hasMoves = CheckersRules.playerHasAnyMove(engine, player);

        if(!hasMoves){
            playIndication.textContent = `${player === 1 ? "Black" : 'White'} has no moves. Game Over!`;

            gameBoard.style.pointerEvents = "none";
            return true;
        }
        return false;
    }
});

// ------ START GAME BUTTON ------
vsHuman.addEventListener('click', () => {
    welcomeScreen.style.display = 'none';  
    gameBoard.style.display = 'grid';
    playIndication.style.display = 'flex';
    playIndication.textContent = "Black's Turn";
    console.log("clicked me");
    // Game Logic start
    engine.createInitialBoard();
    ui.draw(engine.board);
})
