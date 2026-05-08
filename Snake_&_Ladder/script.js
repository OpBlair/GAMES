'use strict';
const gameBoard = document.getElementById('game-board');

for(let a = 100; a > 0; a--){
    let square = document.createElement('div');
    square.classList.add('square');
    square.dataset.index = a;
    square.textContent = a;
    gameBoard.appendChild(square);
}