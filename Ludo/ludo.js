'use strict';
// -------- VARIABLES --------------
const gameBoard = document.getElementById('game-board');
const dice = document.getElementById('dice');
const vsHuman = document.getElementById('human');
const welcomeScreen = document.querySelector('.welcome');

// --------- HOME BASE ----------
const redBase = [0,1,2,3,4,5,15,16,17,18,19,20,30,31,32,33,34,35,45,46,47,48,49,50,60,61,62,63,64,65,75,76,77,78,79,80];
const greenBase = [9,10,11,12,13,14,24,25,26,27,28,29,39,40,41,42,43,44,54,55,56,57,58,59,69,70,71,72,73,74,84,85,86,87,88,89];
const yellowBase = [144,145,146,147,148,149,159,160,161,162,163,164,174,175,176,177,178,179,189,190,191,192,193,194,204,205,206,207,208,209,219,220,221,222,223,224];
const blueBase = [135,136,137,138,139,140,150,151,152,153,154,155,165,166,167,168,169,170,180,181,182,183,184,185,195,196,197,198,199,200,210,211,212,213,214,215];

// ------ TOKEN BASE --------
const basePockets = {
    red: [16, 19, 61, 64],       
    green: [25, 28, 70,73],
    yellow: [160, 163, 205, 208],
    blue: [151, 154, 196, 199]
};

// --------- HOME PATHS ----------
const redPath = [91,106,107,108,109,110];
const greenPath = [22,23,37,52,67,82,97];
const yellowPath = [113,114,115,116,117,118,133];
const bluePath = [127,142,157,172,187,201,202];

// ------- FULL GAME PATH ------
const gamePath = [91, 92, 93, 94, 95, 81, 66, 51, 36, 21, 6, 7, 8, 23, 38, 53, 68, 83, 99, 100, 101, 102, 103, 104, 119, 134, 133, 132, 131, 130, 129, 143, 158, 173, 188, 203, 218, 217, 216, 201, 186, 171, 156, 141, 125, 124, 123, 122, 121, 120, 105, 90];

// -------- TOKEN PATHS ------
const playerPath = {
    red: gamePath,
    green: [...gamePath.slice(13), ...gamePath.slice(0, 13)],   // starts at 23
    yellow: [...gamePath.slice(26), ...gamePath.slice(0, 26)], // starts at 133
    blue: [...gamePath.slice(39), ...gamePath.slice(0, 39)]   // starts at 201
}

const tokenHomePath = {
    red: [106,107,108,109,110,111],
    green: [22,37,52,67,82,97],
    yellow: [118,117,116,115,114,113],
    blue: [202,187,172,157,142,127]
};

const startIndices = {red : 91, green : 23, yellow: 133, blue: 201};
const safeSquares = new Set(Object.values(startIndices));

// Dice Pattern
const dicePatterns = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8]
};

// ---- GAME STATE -----
const gameState = {
    currentPlayerIndex: 0,
    players: ['red', 'green', 'yellow', 'blue'],
    diceValue: null,
    isGameOver: false,
    canRoll: true,
    isMoving: false
}

// -------- CREATE BOARD ----------
function createBoard(){

    // ludo board = 15x15(225 squares)
    for(let i = 0; i < 225; i++){

        //9 indices that make up the 3x3 center
        const centerIndices = [111, 112, 113, 96, 97, 98, 126, 127, 128];

        // Triangle Container at the Center
        if (i === 96) {
            let home = document.createElement('div');
            home.id = 'ludo-home-center';
            // We add the triangles inside
            home.innerHTML = `
                <div class="home-sector red-home square" data-index="111"></div>
                <div class="home-sector green-home square" data-index="97"></div>
                <div class="home-sector yellow-home square" data-index="113"></div>
                <div class="home-sector blue-home square" data-index="127"></div>
            `;
            gameBoard.appendChild(home);
        }

        // Skip the loop logic for all 9 center indices so they don't draw extra squares
        if (centerIndices.includes(i)) continue;

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

// ====== VALIDATION =======
// RENDER DOTS ON THE DICE ----
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

// ----- CHECK IF PATH IS BLOCKED ------
function isSquareBlocked(squareIndex, movingTokenColor){
    const square = document.querySelector(`.square[data-index='${squareIndex}']`);
    const tokensInSquare = square.querySelectorAll('.token');

    if (tokensInSquare.length >= 2){
        const firstTokenColor = tokensInSquare[0].dataset.color;

        if (firstTokenColor !== movingTokenColor){
            return true;
        }
    }
    return false;
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

// ----- CHECK IF ALL TOKENS HAVE REACHED END OF HOME PATH -----
function checkVictory(color){
    const finishedTokens = document.querySelectorAll(`.token.${color}-token.finished`);
    if (finishedTokens.length === 4){
        alert(`Hooray, ${color.toUpperCase()} HAS WON THE GAME!`);
        gameState.isGameOver = true;
        gameState.canRoll = false;
    }
}

// ===== TURN & DICE CONTROL =====
// ----- FUNCTION TO SWITCH PLAYER TURNS -----
function switchTurn(){
    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % 4;
    gameState.canRoll = true;
    gameState.diceValue = null;

    const nextPlayer = gameState.players[gameState.currentPlayerIndex];
    dice.style.borderColor = nextPlayer;
    console.log(`It is now ${nextPlayer}'s turn`);
}

// Function to display number on the dice
function rollDice(){
    if(!gameState.canRoll || gameState.isMoving) return;

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
            const tokensOnBoard = document.querySelectorAll(`.token.${currentPlayer}-token:not(.finished)`);
            const hasTokensOnBoard = Array.from(tokensOnBoard).some(t => t.dataset.location !== 'base');

            if(number !== 6 && !hasTokensOnBoard){
                console.log("No possible moves. Switching turn...");
                gameState.diceValue = null;
                gameState.canRoll = true;
                switchTurn();
            }else{
                if(number === 6){
                    console.log("Rolled a 6! Roll again.");
                }else{
                    console.log("Select a piece to move.");
                }
            }
        }, 800);
    }, 500);
}

// ====== MOVEMENT LOGIC ======
// ---- Function to add click event to the tokens
function handleTokenClick(event){
    if (gameState.isMoving) return;

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
        }
    }else{
        moveAlongPath(clickedToken, gameState.diceValue);
    }
}

// Function to make the first move
function moveFromBaseToStart(clickedToken){
    const color = clickedToken.dataset.color;
    const startSquare = document.querySelector(`.square[data-index='${startIndices[color]}']`);
    startSquare.appendChild(clickedToken);
    clickedToken.dataset.location = 'path';
    clickedToken.dataset.pathIndex = 0;

    if(gameState.diceValue === 6){
        gameState.canRoll = true;
    } else{
        switchTurn();
    }
    gameState.diceValue = null;
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
            gameState.canRoll = true;
            switchTurn();
            return;
        }
    }

    gameState.isMoving = true;
    gameState.canRoll = false;

    for(let j = 0; j < steps; j++){

        // switch from gamePath to Home path.
        if (currentLocation === 'path' && currentPathIndex === playerPath[color].length - 2){
            currentLocation = 'homePath';
            currentPathIndex = -1;
        }
        let nextIndex = currentPathIndex + 1;

        if(currentPathIndex >= playerPath[color].length){
            console.log("Reached end of the gamePath.");
            break;
        }

        let nextSquareIndex;
        if (currentLocation === 'homePath'){
            nextSquareIndex = tokenHomePath[color][nextIndex];
        }else{
            nextSquareIndex = playerPath[color][nextIndex];
        }

        // check if the the path is blocked.
        if (currentLocation === 'path' && isSquareBlocked(nextSquareIndex, color)){
            console.log("Path is Blocked.");
            break;
        }
        currentPathIndex = nextIndex;

        const nextSquare = document.querySelector(`.square[data-index='${nextSquareIndex}']`);
        if (!nextSquare) {
            console.error(`Square not found for index: ${nextSquareIndex}. Stopping movement.`);
            return;
        }
        clickedToken.classList.add('hopping');
        nextSquare.appendChild(clickedToken);

        await new Promise(resolve => setTimeout(resolve, 250));
        clickedToken.classList.remove('hopping');
    }

    clickedToken.dataset.pathIndex = currentPathIndex;
    clickedToken.dataset.location = currentLocation;
    
    // Check if a token has reached the end of home path
    const isFinished = currentLocation === 'homePath' && currentPathIndex === tokenHomePath[color].length - 1;
    if(isFinished) {
        reachedEndOfHomePath(clickedToken);
    }

    let didCapture = captureToken(clickedToken);
    gameState.isMoving = false;

    if(didCapture || isFinished || steps === 6){
        gameState.canRoll = true;
    }else{
        switchTurn();
    }
    gameState.diceValue = null;
}

// ===== RESOLUTION =====
// ----- CAPTURE TOKEN -----
function captureToken(token){
    const color = token.dataset.color;
    const currentSquare = token.parentElement;
    const index = parseInt(currentSquare.dataset.index);
    let didCapture = false;

    if(safeSquares.has(index)) return; // check values in startIndices object since they are safe squares.

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
            didCapture = true;
        }
    }
    return didCapture;
}

// ----- CHECK IF TOKEN IS AT END OF HOME PATH ----
function reachedEndOfHomePath(token){
    console.log(`${token.dataset.color} piece ${token.dataset.pieceIndex} finished.`);
    const color = token.dataset.color;
    token.classList.add('finished');
    token.removeEventListener('click', handleTokenClick);
    token.innerHTML = '👑';

    const centerHome = document.querySelector(`.${color}-home`);
    if(centerHome){
        if (color === 'red') {
            token.style.left = '5px';
        } 
        else if (color === 'green') {
            token.style.top = '5px';
        } 
        else if (color === 'yellow') {
            token.style.right = '5px';
        } 
        else if (color === 'blue') {
            token.style.bottom = '5px';
        }
        centerHome.appendChild(token);
    }

    checkVictory(token.dataset.color);
}

// ---- DICE ROLL EVENT LISTENER -----
dice.addEventListener('click', () => {
    if(!dice.classList.contains('rolling')){
        rollDice();
    }
});

// ------ BUTTON FOR PLAYING AGAINST HUMAN --------
vsHuman.addEventListener('click', () => {
  welcomeScreen.style.display = 'none';  
  document.getElementById('game-ui').style.display = 'flex';
})

// Initialization
createBoard();
addTokens();
renderDiceDots(1);

// ---- MY CHEAT CODE TO MAKE TESTING EASIER -----
const debug_Mode = true;
if(debug_Mode){
    window.devTools = {
        dice(value){
            gameState.diceValue = value;
            gameState.canRoll = false;
            renderDiceDots(value);
            console.log(`🎲 Forced dice: ${value}`);
        },

        move(color, pieceIndex, steps){
            const token = document.querySelector(
                `.token.${color}-token[data-piece-index='${pieceIndex}']`
            );

            if(!token){
                console.log("Token not found");
                return;
            }

            moveAlongPath(token, steps);
            console.log(`🚀 Moved ${color} token ${pieceIndex} by ${steps}`);
        },

        release(color, pieceIndex){
            const token = document.querySelector(
                `.token.${color}-token[data-piece-index='${pieceIndex}']`
            );

            if(!token){
                console.log("Token not found");
                return;
            }

            moveFromBaseToStart(token);
            console.log(`🏁 Released ${color} token ${pieceIndex}`);
        },

        teleport(color, pieceIndex, boardIndex){
            const token = document.querySelector(
                `.token.${color}-token[data-piece-index='${pieceIndex}']`
            );

            const square = document.querySelector(`.square[data-index='${boardIndex}']`);

            if(!token || !square){
                console.log("Invalid teleport target");
                return;
            }

            square.appendChild(token);

            token.dataset.location = 'path';
            token.dataset.pathIndex = boardIndex;

            console.log(`🌀 Teleported ${color} ${pieceIndex} → ${boardIndex}`);
        }
    };
}
