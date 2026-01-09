"use strict";
const gameBoard = document.getElementById('game-board');

//let boardState = Array.from({length: 8}, () => Array(8).fill(null));
//Index=(Row×TotalColumns)+Column
//Row=floor(Index/8)
//Col=Index(mod8)

let boardState = [];
let selectedPiece = null;
let selectedSquare = null;
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
                    //boardState[row][col] = {player: player, king: false};
                    rowArray[col] = {player: player, king: false};
                }
            }
            gameBoard.appendChild(square);
        }
        boardState.push(rowArray);
    }
}
createBoard();
gameBoard.addEventListener('click', (e) =>{
    //clicked a piece
    if(e.target.classList.contains("piece")){
        console.log("Clicked piece on cell:", e.target.dataset.cell);
        console.log("Player:",e.target.dataset.player);
        const fromRow = Math.floor((parseInt(e.target.dataset.cell)) / 8);
        const fromCol = (parseInt(e.target.dataset.cell)) % 8;
        selectedPiece = {
            fromRow: fromRow,
            fromCol: fromCol,
        };
    }else if(e.target.classList.contains("square")){
        console.log("Clicked cell:", e.target.dataset.cell);
        const toRow = Math.floor((parseInt(e.target.dataset.cell)) / 8);
        const toCol = (parseInt(e.target.dataset.cell)) % 8;
        selectedSquare = {
            toRow: toRow,
            toCol: toCol
        }
        if(selectedPiece){
            movePiece(
                selectedPiece.fromRow,
                selectedPiece.fromCol,
                toRow,
                toCol
            );
            selectedPiece = null;
            selectedSquare = null;
        }
    }
})

console.log(boardState);

//helper function for DOM square
function getSquare(row, col){
    const index = row * 8 + col;
    return gameBoard.querySelector(`[data-cell="${index}"]`);
}

function movePiece(fromRow, fromCol, toRow, toCol){
    const pieceData = boardState[fromRow][fromCol];

    // 1.Validation: piece must exist and destination must be empty
    if (!pieceData || boardState[toRow][toCol] !== null) return;

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
    }
}

// get old square
// remove piece
// get new square
// create piece
// append

