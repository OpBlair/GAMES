'use strict';
const gameBoard = document.getElementById('game-board');
const diceElement = document.getElementById('dice');

class GameRules{
    constructor(){
        this.jumps = {
            ladders: [ [4, 14], [9, 31], [20, 38], [28, 84], [40, 59], [51, 67], [63, 81], [71, 91] ],
            snakes: [ [17, 7], [54, 34], [62, 19], [64, 60], [87, 24], [93, 16], [95, 5], [98, 2] ]
        };
    }

    checkForJump(square){
        const allJumps = [ ...this.jumps.ladders, ...this.jumps.snakes ];
        
        for(const [startSquare, endSquare] of allJumps){
            if(square === startSquare){
                const type = startSquare > endSquare ? 'snake' : 'ladder';
                return{
                    startSquare: startSquare,
                    endSquare: endSquare,
                    type: type
                };
            }
        }
        return null;
    }
}

class Board{
    constructor(boardElement){
        this.board = boardElement;
        this.svg = document.getElementById('svg-overlay');
        this.svg.setAttribute('viewBox', `0 0 ${this.board.clientWidth} ${this.board.clientHeight}`);
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

    drawLadder(start, end){
        const startPosition = this.getSquareCenter(start);
        const endPosition = this.getSquareCenter(end);

        // direction vector
        const dx = endPosition.x - startPosition.x;
        const dy = endPosition.y - startPosition.y;

        //perpendicular vector
        const length = Math.sqrt(dx * dx + dy * dy);
        const offsetX = -(dy / length) * 10;
        const offsetY = (dx / length) * 10;

        // Left rail
        this.createLine(
            startPosition.x - offsetX, startPosition.y - offsetY, endPosition.x - offsetX, endPosition.y - offsetY
        )
        // Right rail
        this.createLine(
            startPosition.x + offsetX, startPosition.y + offsetY, endPosition.x + offsetX, endPosition.y + offsetY
        )

        // Ladder Steps
        const steps = 6;
        for(let i = 1; i < steps; i++){
            const t = i / steps;

            const x1 = startPosition.x - offsetX + dx * t;
            const y1 = startPosition.y - offsetY + dy * t;

            const x2 = startPosition.x + offsetX + dx * t;
            const y2 = startPosition.y + offsetY + dy * t;

            this.createLine(x1, y1, x2, y2);
        }
    }

    createLine(x1, y1, x2, y2){
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', 'brown');
        line.setAttribute('stroke-width', '4');

        this.svg.appendChild(line);
    }

    // Snake
    drawSnake(start, end){
        const startPosition = this.getSquareCenter(start);
        const endPosition = this.getSquareCenter(end);

        const dx = endPosition.x - startPosition.x;
        const dy = endPosition.y - startPosition.y;

        // cp1 moves slightly right, cp2 moves slightly left
        const cp1x = startPosition.x + dx * 0.2 + 40; 
        const cp1y = startPosition.y + dy * 0.2;
        const cp2x = startPosition.x + dx * 0.8 - 40;
        const cp2y = startPosition.y + dy * 0.8;

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

        // M = Move to start, Q = Quadratic Bézier curve (control point, then end point)
        // const d = `M ${startPosition.x} ${startPosition.y} Q ${midX} ${midY} ${endPosition.x} ${endPosition.y}`;

        // C = Cubic Bézier (cp1x cp1y, cp2x cp2y, endX endY)
        const d = `M ${startPosition.x} ${startPosition.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endPosition.x} ${endPosition.y}`;

        path.setAttribute('d', d);
        path.setAttribute('stroke', 'green');
        path.setAttribute('fill', 'transparent');
        path.setAttribute('stroke-width', '6');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-dasharray', '1 4'); //scales.
        path.setAttribute('filter', 'drop-shadow(2px 2px 2px rgba(0,0,0,0.3))');

        this.svg.appendChild(path);

        const angle = (Math.atan2(dx, dy) * 180 / Math.PI) - 90;
        this.createSnakehead(startPosition.x, startPosition.y, angle);
    }

    // Creating the head of the snake.
    createSnakehead(x, y, angle){
        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute('transform', `rotate(${angle} ${x} ${y})`);

        // Head Shape
        const head = this.createSVGElement('ellipse', {
            cx: x, cy: y, rx: 16, ry: 12, fill: '#145a32'
        });
        group.appendChild(head);

        // Snake's Tongue
        const tongue = this.createSVGElement('path', {
            d: `M ${x} ${y + 8} L ${x} ${y + 18} M ${x} ${y + 18} L ${x-4} ${y + 22} M ${x} ${y + 18} L ${x+4} ${y + 22}`,
            stroke: '#e74c3c', 'stroke-width': 2, 'stroke-linecap': 'round', fill: 'none'
        });
        group.appendChild(tongue);

        // --- Eyes (White part) ---
        group.appendChild(this.createSVGElement('circle', { cx: x - 6, cy: y - 2, r: 4, fill: 'white' }));
        group.appendChild(this.createSVGElement('circle', { cx: x + 6, cy: y - 2, r: 4, fill: 'white' }));

        // --- Pupils (Black part) ---
        group.appendChild(this.createSVGElement('circle', { cx: x - 6, cy: y - 3, r: 1.5, fill: 'black' }));
        group.appendChild(this.createSVGElement('circle', { cx: x + 6, cy: y - 3, r: 1.5, fill: 'black' }));

        this.svg.appendChild(group);
    }

    createSVGElement(type, attrs) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", type);
    for (let key in attrs) el.setAttribute(key, attrs[key]);
    return el;
}
}

class Dice{
    constructor(diceElement){
        this.dice = diceElement;
        this.isRolling = false;
        this.rollSound = new Audio('./sound/roll.mp3');
        this.dicePatterns = {
            1: [4],
            2: [0, 8],
            3: [0, 4, 8],
            4: [0, 2, 6, 8],
            5: [0, 2, 4, 6, 8],
            6: [0, 2, 3, 5, 6, 8]
        };
    }

    generateRandomNumber(){
        return Math.floor(Math.random() * 6 ) + 1;
    }

    renderDiceDots(number){
        this.dice.innerHTML = '';
        this.dice.classList.remove('rolling');

        for(let i = 0; i < 9; i++){
            const dotSlot = document.createElement('div');
            
            if(this.dicePatterns[number].includes(i)){
                const dot = document.createElement('div');
                dot.classList.add('dot');
                dotSlot.appendChild(dot);
            }
            this.dice.appendChild(dotSlot);
        }
    }

    async rollDice(){
        if(this.isRolling) return;

        this.isRolling = true;
        this.dice.classList.add('rolling');
        this.rollSound.currentTime = 0;
        this.rollSound.play();

        return new Promise((resolve) => {
            setTimeout(() => {
                const result = this.generateRandomNumber();
                this.renderDiceDots(result);
                this.dice.classList.remove('rolling');
                this.isRolling = false;
                resolve(result);
                console.log(`Rolled a ${result}`);
            }, 900);
        });
    }
}

class Player{
    constructor(board, color = '#e74c3c'){
        this.board = board;
        this.currentSquare = 0;
        this.isOnBoard = false;
        this.element = this.createPawn(color);
    }
    
    createPawn(color) {
        const pawn = document.createElement('div');
        pawn.classList.add('pawn');
        pawn.style.backgroundColor = color;
        document.querySelector('.player-lobby').appendChild(pawn);
        pawn.addEventListener('click', () => {
            console.log(`${color} has been clicked.`);
        });
        return pawn;
    }

    moveToBoard(){
        const startSquare = this.currentSquare = 1;
        this.isOnBoard = true;
        // move pawn from lobby into board
        this.board.board.appendChild(this.element);

        // find target square
        const square = this.board.board.querySelector(
            `[data-index='${startSquare}']`
        );

        if(!square) return;

        // position pawn inside the square
        this.element.style.position = 'absolute';

        const boardRect = this.board.board.getBoundingClientRect();
        const squareRect = square.getBoundingClientRect();

        const x = squareRect.left - boardRect.left + 8;
        const y = squareRect.top - boardRect.top + 8;

        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }

    async move(steps) {
        let targetSquare = this.currentSquare + steps;

        if (targetSquare > 100) {
            console.log("Rolled too high to finish!");
            return;
        }

        // Move one square at a time
        for (let next = this.currentSquare + 1; next <= targetSquare; next++) {
            const square = this.board.board.querySelector(`[data-index='${next}']`);
            if (!square) continue;

            const boardRect = this.board.board.getBoundingClientRect();
            const squareRect = square.getBoundingClientRect();

            const x = squareRect.left - boardRect.left + (squareRect.width / 2) - (this.element.offsetWidth / 2);
            const y = squareRect.top - boardRect.top + (squareRect.height / 2) - (this.element.offsetHeight / 2);

            this.element.style.left = `${x}px`;
            this.element.style.top = `${y}px`;
            this.element.classList.add('hopping');

            await new Promise(resolve => setTimeout(resolve, 300)); // pause 300ms per square
            
            this.element.classList.remove('hopping');
        }

        this.currentSquare = targetSquare;
    }
}

class GameState{
    constructor(board, dice, rules, activePlayers){
        this.board = board;
        this.dice = dice;
        this.rules = rules;
        this.currentPlayerIndex = 0;
        this.players = activePlayers;
        this.canRoll = true;
        this.gameOver = false;
        this.isMoving = false;
        this.diceValue = null;

        this.dice.dice.addEventListener('click', () => {
            this.handleDiceRoll();
        })
    }

    async handleDiceRoll(){
        if(!this.canRoll) return;
        this.canRoll = false;

        const diceValue = await this.dice.rollDice();
        this.diceValue = diceValue;

        const player = this.players[this.currentPlayerIndex];

        console.log(`Player ${this.currentPlayerIndex + 1} rolled: ${diceValue}`);
        
        if(!player.isOnBoard){

            if(diceValue === 6){

                player.moveToBoard();

                console.log('Player entered the board!');
                console.log('Roll again!');

                this.canRoll = true;
                return;
            }

            console.log('Need a 6 to enter the board.');

            this.switchTurn();
            return;
        }
        await player.move(diceValue);

        const jump = this.rules.checkForJump(player.currentSquare);
        if(jump){
            console.log(`Oops/ yay! Hit a ${jump.type}. Moving to ${jump.endSquare}`);
            player.currentSquare = jump.endSquare;

            const targetSquareEl = this.board.board.querySelector(`[data-index='${player.currentSquare}']`);
            if (targetSquareEl) {
                const boardRect = this.board.board.getBoundingClientRect();
                const squareRect = targetSquareEl.getBoundingClientRect();

                const x = squareRect.left - boardRect.left + (squareRect.width / 2) - (player.element.offsetWidth / 2);
                const y = squareRect.top - boardRect.top + (squareRect.height / 2) - (player.element.offsetHeight / 2);

                player.element.style.transition = 'left 0.6s ease, top 0.6s ease';
                player.element.style.left = `${x}px`;
                player.element.style.top = `${y}px`;
                
                await new Promise(resolve => setTimeout(resolve, 600));
                player.element.style.transition = '';
            }
        }

        this.switchTurn();
    }

    switchTurn(){
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this.canRoll = true;
    }
}

const board = new Board(gameBoard);
board.createBoard();

const rules = new GameRules();

rules.jumps.ladders.forEach(([start, end]) => {
    board.drawLadder(start, end);
});
rules.jumps.snakes.forEach(([start, end]) => {
    board.drawSnake(start, end);
});

const myDice = new Dice(diceElement);
myDice.renderDiceDots(1);

const player1 = new Player(board,);
const player2 = new Player(board, 'red');
const player3 = new Player(board, 'yellow');

const currentPlayers = [player1, player2, player3];
const game = new GameState(board, myDice, rules, currentPlayers);
//https://www.joshwcomeau.com/svg/friendly-introduction-to-svg/

const debug_Mode = true;

if (debug_Mode) {
    window.devTools = {
        dice(value) {
            if (value < 1 || value > 6) {
                console.error("Dice value must be between 1 and 6");
                return;
            }
            game.diceValue = value;
            myDice.renderDiceDots(value);
            console.log(`Forced dice value to: ${value}. Click the dice to trigger the move logic!`);
        }, 

        async move(color, steps) {
            const player = currentPlayers.find(p => p.element.style.backgroundColor === color);
            if (!player) {
                console.error(`Player with color '${color}' not found.`);
                return;
            }
            if (!player.isOnBoard) {
                console.log(`[DEBUG] Player ${color} is not on the board yet. Teleporting to square 1 first.`);
                player.moveToBoard();
            }
            console.log(`[DEBUG] Moving ${color} forward by ${steps} steps...`);
            await player.move(steps);
        },

        async teleport(color, targetSquare) {
            if (targetSquare < 1 || targetSquare > 100) {
                console.error("Target square must be between 1 and 100");
                return;
            }
            
            const player = currentPlayers.find(p => p.element.style.backgroundColor === color);
            if (!player) {
                console.error(`Player with color '${color}' not found.`);
                return;
            }

            if (!player.isOnBoard) {
                player.moveToBoard();
            }

            player.currentSquare = targetSquare;
            const targetSquareEl = board.board.querySelector(`[data-index='${targetSquare}']`);
            
            if (targetSquareEl) {
                const boardRect = board.board.getBoundingClientRect();
                const squareRect = targetSquareEl.getBoundingClientRect();
                const x = squareRect.left - boardRect.left + (squareRect.width / 2) - (player.element.offsetWidth / 2);
                const y = squareRect.top - boardRect.top + (squareRect.height / 2) - (player.element.offsetHeight / 2);
                
                player.element.style.transition = 'left 0.4s ease, top 0.4s ease';
                player.element.style.left = `${x}px`;
                player.element.style.top = `${y}px`;
                
                await new Promise(resolve => setTimeout(resolve, 400));
                player.element.style.transition = '';
                console.log(`[DEBUG] Teleported ${color} to square ${targetSquare}`);
            }
        }
    };
    console.log("DevTools Active! Use devTools.dice(), devTools.move(), or devTools.teleport() in the console.");
}