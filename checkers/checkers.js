"use strict";
const gameBoard = document.getElementById('game-board');

let boardState = Array.from({length: 8}, () => Array(8).fill(null));

function createBoard(){
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++){
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
                    piece.dataset.player = row < 3 ? 1 : 2;
                    piece.style.backgroundColor = row < 3 ? "black" : "rgb(249, 248, 248)";
                    square.appendChild(piece);
                    let player = row < 3 ? 1 : 2;
                    boardState[row][col] = {player: player, king: false};
                }
            }
            gameBoard.appendChild(square);
        }
    }
}
createBoard();
gameBoard.addEventListener('click', (e) =>{
    //clicked a piece
    if(e.target.classList.contains("piece")){
        console.log("Clicked piece on cell:", e.target.dataset.cell);
        console.log("Player:",e.target.dataset.player);
    }else if(e.target.classList.contains("square")){
        console.log("Clicked cell:", e.target.dataset.cell);
    }
    console.log(`Clicked Cell: ${e.target.dataset.cell}`);
})


console.log(gameBoard);

//Index=(Row×TotalColumns)+Column
//Row=floor(Index/8)
//Col=Index(mod8)