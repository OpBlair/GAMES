'use strict'
const gameBoard = document.getElementById('game-board');

function createBoard(){
    console.log("am running");
    for(let row = 0; row < 16; row++){
        for(let col = 0; col < row; col++){
            let square = document.createElement('div');
            square.classList.add('square');
            gameBoard.appendChild(square);
        }
        
    }
}
createBoard()