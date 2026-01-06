"use strict";
const gameBoard = document.getElementById('game-board');

let pieces = [];

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
                
                if(row < 3){
                    let piece = document.createElement('div');
                    piece.classList.add('piece');
                    piece.style.backgroundColor = "black";
                    square.appendChild(piece);
                    pieces.push({row, col, player: 1});
                }else if(row > 4){
                    let piece = document.createElement('div');
                    piece.classList.add('piece');
                    piece.style.backgroundColor = "rgb(249, 248, 248)";
                    square.appendChild(piece);
                    pieces.push({row, col, player: 2});
                }
            }
            gameBoard.appendChild(square);
        }
    }
}
gameBoard.addEventListener('click', (e) =>{
    console.log(`Clicked Cell: ${e.target.dataset.cell}`);
})
createBoard();
console.log(pieces);

//Index=(Row×TotalColumns)+Column
//Row=floor(Index/8)
//Col=Index(mod8)