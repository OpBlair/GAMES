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
        this.dicePatterns = {
            1: [4],
            2: [0, 8],
            3: [0, 4, 8],
            4: [0, 2, 6, 8],
            5: [0, 2, 4, 6, 8],
            6: [0, 2, 3, 5, 6, 8]
        };
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
}

class Utilities{
    static rollDice(){
        return Math.floor(Math.random() * 6 ) + 1;
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

diceElement.addEventListener('click', () => {
    // Prevent clicking while already rolling
    if (diceElement.classList.contains('rolling')) return;

    diceElement.classList.add('rolling');
    
    setTimeout(() => {
        const result = Utilities.rollDice();
        myDice.renderDiceDots(result);
        console.log(`Rolled a ${result}`);
    }, 600);
});