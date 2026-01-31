'use strict';
const gameBoard = document.getElementById('game-board');
const dice = document.getElementById('dice');
const vsHuman = document.getElementById('human');
const welcomeScreen = document.querySelector('.welcome');

vsHuman.addEventListener('click', () => {
  welcomeScreen.style.display = 'none';  
  gameBoard.style.display = 'grid';
  dice.style.display = 'flex';
})

// --------- HOME BASE ----------
let redBase = [0,1,2,3,4,5,15,16,17,18,19,20,30,31,32,33,34,35,45,46,47,48,49,50,60,61,62,63,64,65,75,76,77,78,79,80];
let greenBase = [9,10,11,12,13,14,24,25,26,27,28,29,39,40,41,42,43,44,54,55,56,57,58,59,69,70,71,72,73,74,84,85,86,87,88,89];
let yellowBase = [144,145,146,147,148,149,159,160,161,162,163,164,174,175,176,177,178,179,189,190,191,192,193,194,204,205,206,207,208,209,219,220,221,222,223,224];
let blueBase = [135,136,137,138,139,140,150,151,152,153,154,155,165,166,167,168,169,170,180,181,182,183,184,185,195,196,197,198,199,200,210,211,212,213,214,215];

// --------- HOME PATHS ----------
let redPath = [91,106,107,108,109,110,111];
let greenPath = [22,23,37,52,67,82,97];
let yellowPath = [113,114,115,116,117,118,133];
let bluePath = [127,142,157,172,187,201,202];

function createBoard(){
    console.log("am running");
    // ludo board = 15x15(225 squares)
    for(let i = 0; i < 225; i++){
        let square = document.createElement('div');
        square.classList.add('square');
        square.dataset.index = i;
        gameBoard.appendChild(square);

        if(redBase.includes(i)){
            square.classList.add('red-base');
        }
        if(greenBase.includes(i)){
            square.classList.add('green-base');
        }
        if(blueBase.includes(i)){
            square.classList.add('blue-base');
        }
        if(yellowBase.includes(i)){
            square.classList.add('yellow-base');
        }

        if(redPath.includes(i)){
            square.classList.add('red-path');
        }
        if(greenPath.includes(i)){
            square.classList.add('green-path');
        }
        if(bluePath.includes(i)){
            square.classList.add('blue-path');
        }
        if(yellowPath.includes(i)){
            square.classList.add('yellow-path');
        }
    }
}
// Function to add tokens(pieces)
function addTokens(){
    const playerTokens = 4;
    const bases = {
        red: redBase.slice(0, playerTokens),
        green: greenBase.slice(0, playerTokens),
        yellow: yellowBase.slice(0, playerTokens),
        blue: blueBase.slice(0, playerTokens)
    };

    for(const color in bases){
        bases[color].forEach(index => {
        const token = document.createElement('div');
        token.classList.add('token', `${color}-token`);
        //append token to the square
        document.querySelector(`.square[data-index='${index}']`).appendChild(token);
        });
    }
}
// Function to display number on the dice
function rollDice(){
    let number = Math.floor((Math.random() * 6) + 1);
    dice.textContent = number;
}
// ---- DICE ROLL EVENT LISTENER -----
dice.addEventListener('click', () => {
    rollDice();
});

createBoard();
addTokens();
