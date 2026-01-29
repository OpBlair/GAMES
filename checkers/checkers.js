"use strict";
const gameBoard = document.getElementById('game-board');
const playIndication = document.querySelector('.turn-indicator');
const vsHuman = document.getElementById('human');
const welcomeScreen = document.querySelector('.welcome');
//let boardState = Array.from({length: 8}, () => Array(8).fill(null));
//Index=(Row×TotalColumns)+Column
//Row=floor(Index/8)
//Col=Index(mod8)

let boardState = [];
let selectedPiece = null;
let currentPlayer = 2;

vsHuman.addEventListener('click', () => {
  welcomeScreen.style.display = 'none';  
  gameBoard.style.display = 'grid';
  document.querySelector('.turn-indicator').style.display = "flex";
})

// -------------- CREATE BOARD -----------
function createBoard(){
    for (let row = 0; row < 8; row++) {
        let rowArray = []
        for (let col = 0; col < 8; col++){
            rowArray[col] = null;
            let  square = document.createElement('div');
        
            square.classList.add('square');

            let cellIndex = row * 8  + col;
            square.dataset.cell = cellIndex;
            if( (row + col) % 2 === 0){
                square.classList.add('light');
            }else{
                square.classList.add('dark');
                
                if(row < 3 || row > 4){
                    const piece = document.createElement('div');
                    piece.classList.add('piece');
                    piece.dataset.cell = cellIndex;
                    let player = row < 3 ? 1 : 2;
                    piece.dataset.player = player;
                    piece.style.backgroundColor = row < 3 ? "black" : "rgb(249, 248, 248)";
                    square.appendChild(piece);
                    rowArray[col] = {player: player, king: false};
                }
            }
            gameBoard.appendChild(square);
        }
        boardState.push(rowArray);
    }
    playIndication.textContent = "White's Turn";
}
createBoard();

gameBoard.addEventListener('click', (e) =>{
    const fromRow = Math.floor((parseInt(e.target.dataset.cell)) / 8);
    const fromCol = (parseInt(e.target.dataset.cell)) % 8;
        
    // If multi-jump is in progress, force selection of that piece
    if(selectedPiece && e.target.classList.contains("piece")) {
        if(selectedPiece.fromRow !== fromRow || selectedPiece.fromCol !== fromCol){
            console.log("You must continue jumping with same piece");
            return;
        } 
    }
    
    //clicked a piece
    if (e.target.classList.contains("piece")) {
        if(parseInt(e.target.dataset.player) !== currentPlayer) return;
        console.log("Clicked piece on cell:", e.target.dataset.cell);
        console.log("Player:",e.target.dataset.player);
        clearHightLights();
        //hightlight selection
        document.querySelectorAll('.piece').forEach(p => p.classList.remove('selected-piece'));
        selectedPiece = {
            fromRow: fromRow,
            fromCol: fromCol,
        };
        e.target.classList.add('selected-piece');
        highlightMoves(fromRow, fromCol);
    } else if (e.target.classList.contains("square")){
        console.log("Clicked cell:", e.target.dataset.cell);
        const toRow = Math.floor((parseInt(e.target.dataset.cell)) / 8);
        const toCol = (parseInt(e.target.dataset.cell)) % 8;

        //only move if a piece is selected
        if(selectedPiece){
            movePiece(
            selectedPiece.fromRow,
            selectedPiece.fromCol,
                toRow,
                toCol
            );
            selectedPiece = null;
            document.querySelectorAll('.piece').forEach(p => p.classList.remove('selected-piece')); 
        }
    }
})

// -------------- HELPERS ----------------
function getSquare(row, col){
    const index = row * 8 + col;
    return gameBoard.querySelector(`[data-cell="${index}"]`);
}

// ---- HELPER.2. PIECE HAS MOVE ---------
function pieceHasMove(row, col){
    const piece = boardState[row][col];
    if(!piece) return false;

    const directions = [];

    if(piece.king){
        directions.push([-1,-1], [-1, 1], [1,-1], [1, 1], [-2, -2], [-2, 2], [2, -2], [2, 2]);
    }else{
        if(piece.player === 1) directions.push([1, -1], [1, 1], [2, -2], [2, 2]);
        if(piece.player === 2) directions.push([-1, -1], [-1, 1], [-2, -2], [-2, 2]);
    }

    for(const [dRow, dCol] of directions){
        const newRow = row + dRow;
        const newCol = col + dCol;

        if(newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) continue;
        if(boardState[newRow][newCol] !== null) continue;

        //simple move
        if(Math.abs(dRow) === 1) return true;

        //jump move
        if(Math.abs(dRow) === 2){
            const midRow = (row + newRow) / 2;
            const midCol = (col + newCol) / 2;
            const midPiece = boardState[midRow][midCol];
            if(midPiece && midPiece.player !== piece.player) return true;
        }
    }
    return false;
}

// 3. --- Does a player have any legal moves
function playerHasAnyMove(player){
    for(let row = 0; row < 8; row++){
        for(let col = 0; col < 8; col++){
            const piece = boardState[row][col];
            if(piece && piece.player === player){
                if(pieceHasMove(row, col)) return true;
            }
        }
    }
    return false;
}

// 4. ----- count pieces
function countPieces(player){
    let count = 0;
    for(let row = 0; row < 8; row++){
        for(let col = 0; col < 8; col++){
            const piece = boardState[row][col];
            if(piece && piece.player === player) count++;
        }
    }
    return count;
}

// 5. ------ HIGHLIGHT SQUARES ----------
function clearHightLights(){
    document.querySelectorAll('.highlight-move, .highlight-jump, .attackable').forEach(
        highlight => highlight.classList.remove('highlight-move', 'highlight-jump', 'attackable')
    );
}

// --------- GET LEGAL MOVES -----------
function getLegalMoves(row, col){
    const piece = boardState[row][col];
    if(!piece) return [];

    const directions = [];
    const moves = [];

    if(piece.king){
        directions.push([-1,-1], [-1, 1], [1,-1], [1, 1], [-2, -2], [-2, 2], [2, -2], [2, 2]);
    }else{
        if(piece.player === 1) directions.push([1, -1], [1, 1], [2, -2], [2, 2]);
        if(piece.player === 2) directions.push([-1, -1], [-1, 1], [-2, -2], [-2, 2]);
    }

    const mustJump = playerHasJump(piece.player);

    for(const [dRow, dCol] of directions){
        const newRow = row + dRow;
        const newCol = col + dCol;

        if(newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) continue;
        if(boardState[newRow][newCol] !== null) continue;

        //simple move
        if(Math.abs(dRow) === 1 && !mustJump){
            moves.push({toRow: newRow, toCol: newCol, jump: false});
        }
        //jump move
        if(Math.abs(dRow) === 2){
            const midRow = (row + newRow) / 2;
            const midCol = (col + newCol) / 2;
            const midPiece = boardState[midRow][midCol];
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
    }
    return moves;
}

// --------- HIGHLIGHT MOVES ----------
function highlightMoves(row, col){
    clearHightLights();

    const moves = getLegalMoves(row, col);

    moves.forEach(move => {
        const square = getSquare(move.toRow, move.toCol);

        if(move.jump){
            square.classList.add('highlight-jump');

            const enemySquare = getSquare(move.attackRow, move.attackCol);
            const enemyPiece = enemySquare.querySelector('.piece');
            if(enemyPiece) enemyPiece.classList.add('attackable');
        }else{
            square.classList.add('highlight-move');
        }
    });
}

// --------- Game Over ----------
function gameOver(){
    const playerToMove = currentPlayer;

    const piecesLeft = countPieces(playerToMove);
    const hasMoves = playerHasAnyMove(playerToMove);

    if(piecesLeft === 0 || !hasMoves){
        playIndication.textContent = `${playerToMove === 1 ? "Black" : "White"} has no moves. Game Over!`;
        gameBoard.style.pointerEvents = 'none';
        console.log("Game Over");
        return true;
    }
    return false;
}

// ------------- FORCED CAPTURE ----------
function playerHasJump(player){
    for(let row = 0; row < 8; row++){
        for(let col = 0; col < 8; col++){
            const piece = boardState[row][col];
            if(piece && piece.player === player){
                if(canJumpAgain(row, col)) return true;
            }
        }
    }
    return false;
}

// ---------------  MULTI-JUMP ----------------
function canJumpAgain(row, col){
    const piece = boardState[row][col];
    if(!piece) return false;

    //Jump Directions
    const directions = [];
    if(piece.king){
        directions.push([-2, -2], [-2, 2], [2, -2], [2, 2]);
    }else{
        if(piece.player === 1) directions.push([2, -2], [2, 2]);
        if(piece.player === 2) directions.push([-2, -2], [-2, 2]);
    }

    for(let [dRow, dCol] of directions){
        const newRow = row + dRow;
        const newCol = col + dCol;
        const newMidRow = (row + newRow) / 2;
        const newMidCol = (col + newCol) / 2;

        //Check boundaries
        if(newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) continue;

        //Landing square must be empty
        if(boardState[newRow][newCol] !== null) continue;

        const middlePiece = boardState[newMidRow][newMidCol];
        //middle piece must exist and belong to opponent
        if(middlePiece && middlePiece.player !== piece.player) return true;
    }
    return false;
}

// ------------------ MOVE PIECE ----------------
function movePiece(fromRow, fromCol, toRow, toCol){
    const pieceData = boardState[fromRow][fromCol];
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol)
    const midRow = Math.floor((fromRow + toRow) / 2);
    const midCol = Math.floor((fromCol + toCol) / 2);

    if(rowDiff !== colDiff) return;
    if((toRow + toCol) % 2 === 0) return;
    if((rowDiff !== 1 && rowDiff !== 2) || (colDiff !== 1 && colDiff !== 2)) return;

    // 1.Validation: piece must exist and destination must be empty
    if (!pieceData || boardState[toRow][toCol] !== null) return;
    const mustJump = playerHasJump(pieceData.player);

    // 2.Logic of a Move. black moves down, white moves up
    // if NOt a king enforce above rules.
    if(!pieceData.king){
        if(pieceData.player === 1 && toRow <= fromRow) return;
        if(pieceData.player === 2 && toRow >= fromRow) return;
    }
    //piece promotion
    if(pieceData.player === 1 && toRow === 7){
        pieceData.king = true;
    }
    if(pieceData.player === 2 && toRow === 0){
        pieceData.king = true;
    }

    // Jump is Mandatory.
    if(mustJump && rowDiff !== 2) return;
  
    if(rowDiff === 2){
        //if((boardState[fromRow][fromCol].player === 1 && boardState[midRow][midCol].player === 1) || (boardState[fromRow][fromCol].player === 2 && boardState[midRow][midCol].player === 2)) return;
        const jumpedPiece = boardState[midRow][midCol];
        if(!jumpedPiece || jumpedPiece.player === pieceData.player) return;
        boardState[midRow][midCol] = null;
        getSquare(midRow, midCol).querySelector('.piece').remove();
    }

    //update boardState
    boardState[fromRow][fromCol] = null;
    boardState[toRow][toCol] = pieceData;

    // Move the Piece.
    const oldSquare = getSquare(fromRow, fromCol);
    const newSquare = getSquare(toRow, toCol);
    const pieceElement = oldSquare.querySelector('.piece');
        
    if(pieceElement){
        newSquare.appendChild(pieceElement);
        pieceElement.dataset.cell = toRow * 8 + toCol;
        clearHightLights();
        //Visual feedback for King
        if(pieceData.king){
            pieceElement.style.border = "4px solid gold";
            pieceElement.innerHTML = '👑';
        }
        
        //MultiJump Logic
        if(rowDiff === 2 && canJumpAgain(toRow, toCol)){
            //Lock selection to current piece
            selectedPiece = {fromRow: toRow, fromCol: toCol};
            pieceElement.classList.add('selected-piece');
            playIndication.textContent = `Player ${pieceData.player === 1 ? "Black" : "White"} must jump again`;
        } else {
            //No more jumps, switch Turn
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            switch(currentPlayer){
                case 1:
                    playIndication.textContent = "Black's Turn";
                    break;
                case 2:
                    playIndication.textContent = "White's Turn";
                    break;
            }
            gameOver();
        }
    }
}
