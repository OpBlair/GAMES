"use strict";
const gameBoard = document.getElementById('game-board');
const playIndication = document.querySelector('.turn-indicator');
//let boardState = Array.from({length: 8}, () => Array(8).fill(null));
//Index=(Row×TotalColumns)+Column
//Row=floor(Index/8)
//Col=Index(mod8)

let boardState = [];
let selectedPiece = null;
let currentPlayer = 2;

//Create Board Function
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

        //hightlight selection
        document.querySelectorAll('.piece').forEach(p => p.classList.remove('selected-piece'));
        selectedPiece = {
            fromRow: fromRow,
            fromCol: fromCol,
        };
        e.target.classList.add('selected-piece');

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

//helper function for DOM square
function getSquare(row, col){
    const index = row * 8 + col;
    return gameBoard.querySelector(`[data-cell="${index}"]`);
}

//Additional Jumps
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

// MOve piece function
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
        }
    }
}
