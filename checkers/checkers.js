"use strict";
const gameBoard = document.getElementById('game-board');

let pieces = [];

function createBoard(){
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++){
            let  square = document.createElement('div');
            square.classList.add('square');

            if( (row + col) % 2 === 0){
                square.classList.add('light');

            }else{
                square.classList.add('dark');

                if(row < 3){
                    let piece = document.createElement('div');
                    piece.classList.add('piece');
                    piece.style.backgroundColor = "red";
                    square.appendChild(piece);
                    pieces.push({row, col, player: 1});
                }else if(row > 4){
                    let piece = document.createElement('div');
                    piece.classList.add('piece');
                    piece.style.backgroundColor = "black";
                    square.appendChild(piece);
                    pieces.push({row, col, player: 2});
                }
            }
            gameBoard.appendChild(square);
        }
    }
}

createBoard();
