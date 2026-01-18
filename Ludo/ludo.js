'use strict'
const gameBoard = document.getElementById('game-board');

function createBoard(){
    console.log("am running");
    // ludo board = 15x15(225 squares)
    for(let i = 0; i < 225; i++){
        let square = document.createElement('div');
        square.classList.add('square');
        square.dataset.index = i;
        gameBoard.appendChild(square);
        
    }
}
createBoard()