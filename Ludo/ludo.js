'use strict';
// -------- VARIABLES --------------
const gameBoard = document.getElementById('game-board');
const dice = document.getElementById('dice');
const vsHuman = document.getElementById('human');
const welcomeScreen = document.querySelector('.welcome');

// ------ BUTTON FOR PLAYING AGAINST HUMAN --------
vsHuman.addEventListener('click', () => {
  welcomeScreen.style.display = 'none';  
  gameBoard.style.display = 'grid';
  dice.style.display = 'grid';
})

// --------- HOME BASE ----------
let redBase = [0,1,2,3,4,5,15,16,17,18,19,20,30,31,32,33,34,35,45,46,47,48,49,50,60,61,62,63,64,65,75,76,77,78,79,80];
let greenBase = [9,10,11,12,13,14,24,25,26,27,28,29,39,40,41,42,43,44,54,55,56,57,58,59,69,70,71,72,73,74,84,85,86,87,88,89];
let yellowBase = [144,145,146,147,148,149,159,160,161,162,163,164,174,175,176,177,178,179,189,190,191,192,193,194,204,205,206,207,208,209,219,220,221,222,223,224];
let blueBase = [135,136,137,138,139,140,150,151,152,153,154,155,165,166,167,168,169,170,180,181,182,183,184,185,195,196,197,198,199,200,210,211,212,213,214,215];

// ------ TOKEN BASE --------
const basePockets = {
    red: [16, 19, 61, 64],       
    green: [25, 28, 70,73],
    yellow: [160, 163, 205, 208],
    blue: [151, 154, 196, 199]
};

// --------- HOME PATHS ----------
let redPath = [91,106,107,108,109,110,111];
let greenPath = [22,23,37,52,67,82,97];
let yellowPath = [113,114,115,116,117,118,133];
let bluePath = [127,142,157,172,187,201,202];

// ------- FULL GAME PATH ------
const gamePath = [91, 92, 93, 94, 95, 96, 81, 66, 51, 36, 21, 6, 7, 8, 23, 38, 53, 68, 83, 98, 99, 100, 101, 102, 103, 104, 119, 134, 133, 132, 131, 130, 129, 128, 143, 158, 173, 188, 203, 218, 217, 216, 201, 186, 171, 156, 141, 126, 125, 124, 123, 122, 121, 120, 105, 90];

// -------- TOKEN PATHS ------
const playerPath = {
    red: gamePath,
    green: [...gamePath.slice(14), ...gamePath.slice(0, 14)],   // starts at 23
    yellow: [...gamePath.slice(28), ...gamePath.slice(0, 28)], // starts at 133
    blue: [...gamePath.slice(42), ...gamePath.slice(0, 42)]   // starts at 201
}

const tokenHomePath = {
    red: [105,106,107,108,109,110,111],
    green: [7,22,37,52,67,82,97],
    yellow: [119,118,117,116,115,114,113],
    blue: [217,202,187,172,157,142,127]
};

// -------- CREATE BOARD ----------
function createBoard(){

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

    for(const color in basePockets){
        basePockets[color].forEach((index, i) => {
            const square = document.querySelector(`.square[data-index='${index}']`);
            if(square){
                const token = document.createElement('div');
                token.classList.add('token', `${color}-token`);
                token.dataset.color = color;
                token.dataset.pieceIndex = i;
                token.dataset.location = 'base';
                token.addEventListener('click', handleTokenClick);
                square.appendChild(token);
            }
        })
    }
}

// ---- Function to add click event to the tokens
function handleTokenClick(event){
    const clickedToken = event.target;
    const tokenColor = clickedToken.dataset.color;
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    // check if its current player's turn.
    if(tokenColor !== currentPlayer){
        console.log("It's not your turn.");
        return;
    }

    // Check if dice has been rolled.
    if(gameState.diceValue === null){
        console.log("Roll dice first.");
        return;
    }

    //Move piece
    if(clickedToken.dataset.location === 'base'){
        if(gameState.diceValue === 6){
            moveFromBaseToStart(clickedToken);
            gameState.diceValue = null;
            gameState.canRoll = true;
        }
    }else{
        moveAlongPath(clickedToken, gameState.diceValue);
    }
}

// Function to make the first move
function moveFromBaseToStart(clickedToken){
    const color = clickedToken.dataset.color;
    const startIndices = {red : 91, green : 23, yellow: 133, blue: 201};
    const startSquare = document.querySelector(`.square[data-index='${startIndices[color]}']`);
    startSquare.appendChild(clickedToken);
    clickedToken.dataset.location = 'path';
    clickedToken.dataset.pathIndex = 0;
}

// ---- MOVE TOKEN ALONG THE BOARD ----.
async function moveAlongPath(clickedToken, steps){
    const color = clickedToken.dataset.color;
    let currentPathIndex = parseInt(clickedToken.dataset.pathIndex);
    let currentLocation = clickedToken.dataset.location;

    if (currentLocation === 'homePath'){
        const isMoveValid = homePath(clickedToken, gameState.diceValue);
        if(!isMoveValid){
            gameState.diceValue = null;
            switchTurn();
            return;
        }
    }

    gameState.canRoll = false;
    for(let j = 0; j < steps; j++){

        // switch from gamePath to Home path.
        if (currentLocation === 'path' && currentPathIndex === 54){
            currentLocation = 'homePath';
            currentPathIndex = 0;
        }
        currentPathIndex++;

        if(currentPathIndex >= playerPath[color].length){
            console.log("Reached end of the gamePath.");
            break;
        }

        let nextSquareIndex;
        if (currentLocation === 'homePath'){
            nextSquareIndex = tokenHomePath[color][currentPathIndex];
        }else{
            nextSquareIndex = playerPath[color][currentPathIndex]
        }

        const nextSquare = document.querySelector(`.square[data-index='${nextSquareIndex}']`);

        clickedToken.classList.add('hopping');
        nextSquare.appendChild(clickedToken);

        await new Promise(resolve => setTimeout(resolve, 300));
        clickedToken.classList.remove('hopping');
    }

    clickedToken.dataset.pathIndex = currentPathIndex;
    clickedToken.dataset.location = currentLocation;
    
    if(gameState.diceValue === 6){
        gameState.canRoll = true;
    }else{
        switchTurn();
    }
    gameState.diceValue = null;
    captureToken(clickedToken);
}

// ----- CAPTURE TOKEN -----
function captureToken(token){
    const color = token.dataset.color;
    const currentSquare = token.parentElement;
    
    if (currentSquare.classList.contains('start-indices')) return false;
    const tokenInside = currentSquare.querySelectorAll('.token');

    for(const resident of tokenInside){
        if (resident === token) continue;
        if (resident.dataset.color !== color){
            const victimColor = resident.dataset.color;
            const victimIndex = resident.dataset.pieceIndex; 
            const baseSquareIndex = basePockets[victimColor][victimIndex];
            const baseSquare = document.querySelector(`.square[data-index='${baseSquareIndex}']`);
            
            baseSquare.appendChild(resident);
            console.log(`${color} just captured ${victimColor}'s token number ${victimIndex}`);
            resident.dataset.location = 'base';
            resident.dataset.pathIndex = 0;
        }
    }
}

// ----- HOME PATH MOVEMENT ------
function homePath(token, steps){
    const color = token.dataset.color;
    const currentHomeIndex = parseInt(token.dataset.pathIndex);
    const maxIndex = tokenHomePath[color].length - 1;

    if (currentHomeIndex + steps > maxIndex){
        console.log("Roll is too high! You need an exact match to finish.");
        return false;
    }
    return true;
}

// Dice Pattern
const dicePatterns = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8]
};

// Function to display number on the dice
function rollDice(){
    if(!gameState.canRoll) return;

    // animation
    gameState.canRoll = false;
    dice.classList.add('rolling');
    dice.innerHTML = '';

    setTimeout(() => {
        dice.classList.remove('rolling');

        let number = Math.floor((Math.random() * 6) + 1);
        gameState.diceValue = number;
        renderDiceDots(number);

        setTimeout(() => {
            const currentPlayer = gameState.players[gameState.currentPlayerIndex];
            const tokensOnBoard = document.querySelectorAll(`.token.${currentPlayer}-token[data-location="path"]`);
            const hasTokensOnBoard = tokensOnBoard.length > 0;

            if(number !== 6 && !hasTokensOnBoard){
                console.log("No possible moves. Switching turn...");
                gameState.diceValue = null;
                switchTurn();
            }else{
                if(number === 6){
                    console.log("Rolled a 6! Roll again.");
                    gameState.canRoll = true;
                }else{
                    console.log("Select a piece to move.");
                    gameState.canRoll = false;
                }
            }
        }, 1000);
    }, 500);
}

function renderDiceDots(number){
    dice.innerHTML = '';

    for(let i = 0; i < 9; i++){
        const dotSlot = document.createElement('div');
        
        if(dicePatterns[number].includes(i)){
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dotSlot.appendChild(dot);
        }
        dice.appendChild(dotSlot);
    }
}

// ---- DICE ROLL EVENT LISTENER -----
dice.addEventListener('click', () => {
    if(!dice.classList.contains('rolling')){
        rollDice();
    }
});
renderDiceDots(1);

// ---- GAME STATE -----
const gameState = {
    currentPlayerIndex: 0,
    players: ['red', 'green', 'yellow', 'blue'],
    diceValue: null,
    isGameOver: false,
    canRoll: true,
    positions: {
        red: [16, 19, 61, 64],       
        green: [25, 28, 70,73],
        yellow: [160, 163, 205, 208],
        blue: [151, 154, 196, 199]
    }
}

// ----- FUNCTION TO SWITCH PLAYER TURNS -----
function switchTurn(){
    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % 4;
    gameState.canRoll = true;
    gameState.diceValue = null;
    const nextPlayer = gameState.players[gameState.currentPlayerIndex];
    dice.style.borderColor = nextPlayer;
    console.log(`It is now ${nextPlayer}'s turn`);
}
createBoard();
addTokens();
