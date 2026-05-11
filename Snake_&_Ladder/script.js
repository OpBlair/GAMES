'use strict';
const gameBoard = document.getElementById('game-board');

class GameRules{
    constructor(){
        this.jumps = {
            ladders: [ [4, 14], [9, 31], [20, 38], [28, 84], [40, 59], [51, 67], [63, 81], [71, 91] ],
            snakes: [ [17, 7], [54, 34], [62, 19], [64, 60], [87, 24], [93, 16], [95, 5], [98, 2] ]
        };
    }
}

class Board{
    constructor(boardElement){
        this.board = boardElement;
    }

    createBoard(){
        for(let row = 9; row >= 0; row--){
            if(row % 2 === 0){
                for(let col = 0; col < 10; col++){
                    let num = row * 10 + col + 1;
                    this.createSquare(num);
                }
            }else{
                for(let col = 9; col >= 0; col--){
                    let num = row * 10 + col + 1;
                    this.createSquare(num);
                }
            }
        }
    }

    createSquare(number){
        const square = document.createElement('div');
        square.classList.add('square');
        square.dataset.index = number;
        square.textContent = number;
        this.board.appendChild(square);
    }

    getSquareCenter(num){
        const square = this.board.querySelector(`[data-index='${num}']`);
        const boardRect = this.board.getBoundingClientRect();
        const rect = square.getBoundingClientRect();

        return{
            x: rect.left - boardRect.left + rect.width / 2,
            y: rect.top - boardRect.top + rect.height / 2
        };
    }
}

const board = new Board(gameBoard);
board.createBoard();