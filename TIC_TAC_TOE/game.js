'use strict'
/*
const gameCell = document.querySelectorAll('.game-cell');

gameCell.forEach(cell => {
	cell.addEventListener('click', () => {
		console.log('I was clicked.');
	});
});*/

//Game Array
let gameArray = Array(9).fill("");

//current Player
let currentPlayer = 'x';

//game status
let gameActive = true;

//Player selection
let selectedPlayer = null;

//tracking scores
let scores = {x: 0, ties: 0, o: 0};

const playerVariables = document.querySelectorAll('.player-variable');
const gameTable = document.querySelector('.game-table');
const welcomePage = document.querySelector('.welcome-page');
const newGameBtn = document.querySelectorAll('button')[1]; // vs human
const restartBtn = document.querySelector('.restart-btn');
const turnVariable = document.querySelector('.turn-variable');
const gameTop = document.querySelector('.game-table-top');
const gameBottom = document.querySelector('.game-table-bottom');
const difficultyBtn = document.querySelectorAll('.difficulty-btn');
const vsComputer = document.querySelector('.vs-computer');

//player selection
playerVariables.forEach(player => {
	player.addEventListener('click', () => {
		selectedPlayer = player.dataset.index;

		//visual feedback
		playerVariables.forEach(p => p.classList.remove('active'));
		player.classList.add('active');
	})
})

//new Game button
newGameBtn.addEventListener('click', () => {
	if(!selectedPlayer){
		alert('please select X 0r O first');
		return;
	}
	turnVariable.textContent = currentPlayer;
	//switch screen
	welcomePage.style.display = 'none';
	gameTable.style.display = 'grid';
	gameTop.style.display = 'flex';
	gameBottom.style.display = 'flex';
})

// Win Conditions
let winPattern = [
	[0,1,2],[3,4,5],[6,7,8],
	[0,3,6],[1,4,7],[2,5,8],
	[0,4,8],[2,4,6]
];

// Result Validation 
function handleResultValidation(){
	for(let i = 0; i < winPattern.length; i++){
		//console.log(winPattern[i]);
		
		let a = winPattern[i][0];
		let b = winPattern[i][1];
		let c = winPattern[i][2];

		if(gameArray[a] !== "" && gameArray[a] === gameArray[b] && gameArray[b] === gameArray[c]){
			gameActive = false;

			setTimeout( () => {
				alert(`Game Over. ${gameArray[a]} won !`);
			}, 1000);

			return; // stop the loop after a win is detected.
		}
	}

	// Check for a draw(after win check.)
	if(!gameArray.includes("")){
		gameActive = false; //stop the board.

		setTimeout( () => {
			alert(`Game Over. It's a draw!`);
		}, 1000);
		return;
	}	
}

//Event Delegation
gameTable.addEventListener('click', (e) => {
	//console.log(e);
	if(!gameActive) return;

	if(e.target.classList.contains('game-cell')){

		let cellNumber = parseInt(e.target.dataset.index);

		//console.log('Cell clicked:', cellNumber);
		
		if(gameArray[cellNumber] !== ""){
			return;
		}else{
			gameArray[cellNumber] = currentPlayer;
			e.target.textContent = currentPlayer;
			
			handleResultValidation();
			
			if(gameActive){
				currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
				turnVariable.textContent = currentPlayer;
			}
		}
	}

	if(currentPlayer === 'o'){
		setTimeout(ComputerMove, 1000);
	}
});

//Reset Game Function
function resetGame(){
	gameArray = Array(9).fill("");
	gameActive = true;
	currentPlayer = "x";
	turnVariable.textContent = currentPlayer;

	document.querySelectorAll('.game-cell').forEach(cell => {
		cell.textContent = "";
	});
}

//restart button
restartBtn.addEventListener('click', () => {
	resetGame();
})

//difficulty buttons
let difficulty;
difficultyBtn.forEach(btn => {
	btn.addEventListener('click', (e) => {
		difficulty = e.target.dataset.level;

		console.log(`Level: ${difficulty}`);
	})
})

setTimeout( () => {
	console.log(`Selected Level: ${difficulty}`);
}, 2000);

function ComputerMove(){
	if(!gameActive) return;

	let moveIndex;

	switch(difficulty){
	case 'easy':
		moveIndex = RandomMove();
		break;
	case 'medium':
		moveIndex = SmartMove();
		break;
	case 'hard':
		moveIndex = BestMove();
		break;
	default:
		moveIndex = RandomMove();
	}

	if(moveIndex !== undefined){
		gameArray[moveIndex] = currentPlayer;
		document.querySelector(`.game-cell[data-index="${moveIndex}"]`).textContent = currentPlayer;

		handleResultValidation();

		if(gameActive){
			currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
			turnVariable.textContent = currentPlayer;
		}
	}
}


function RandomMove(){
	//get empty cells indexes
	let emptyCells = [];

	for(let i = 0; i < gameArray.length; i++){
		if(gameArray[i] === ""){
			emptyCells.push(i);
		}
	}

	//no moves left
	if(emptyCells.length === 0) return;

	let randomIndex = Math.floor(Math.random() * emptyCells.length);
	let move = emptyCells[randomIndex];

	console.log(`Random Index: ${move}`);
	return move;
}

