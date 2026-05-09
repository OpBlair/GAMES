'use strict';
const gameBoard = document.getElementById('game-board');

for(let row = 9; row >= 0; row--){
    if(row % 2 === 0){
        for(let col = 0; col < 10; col++){
            let num = row * 10 + col + 1;
            addSquare(num);
        }
    }else{
        for(let col = 9; col >= 0; col--){
            let num = row * 10 + col + 1;
            addSquare(num);
        }
    }
}

function addSquare(number){
    let square = document.createElement('div');
    square.classList.add('square');
    square.dataset.index = number;
    square.textContent = number;
    gameBoard.appendChild(square);
}