'use strict'

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
const restartBtn = document.querySelector('.restart-btn');
const turnVariable = document.querySelector('.turn-variable');
const gameTop = document.querySelector('.game-table-top');
const gameBottom = document.querySelector('.game-table-bottom');
const difficultyBtn = document.querySelectorAll('.difficulty-btn');
const newGameBtn = document.querySelectorAll('button')[1]; // vs human
const vsComputer = document.querySelector('.vs-computer');
const difficultyMenu = document.querySelector('.difficulty-menu');

//player selection
playerVariables.forEach(player => {
	player.addEventListener('click', () => {
		selectedPlayer = player.dataset.index;

		//visual feedback
		playerVariables.forEach(p => p.classList.remove('active'));
		player.classList.add('active');
	})
})

//Game Mode selection
let gameMode;

//new Game button
newGameBtn.addEventListener('click', () => {
	gameMode = 'human'
	if(!selectedPlayer){
		alert('please select X 0r O first');
		return;
	}
	turnVariable.textContent = currentPlayer;
	//switch screen
	startGame();
});

//New game against computer
vsComputer.addEventListener('click', () => {
	if(!selectedPlayer){
		alert('please select X 0r O first');
		return;
	}

	gameMode = 'computer';
	difficultyMenu.style.display = 'flex';
	
});

//start game
function startGame(){
	welcomePage.style.display = 'none';
	gameTable.style.display = 'grid';
	gameTop.style.display = 'flex';
	gameBottom.style.display = 'flex';

	if(gameMode === 'computer' && selectedPlayer === 'o' && currentPlayer === 'x'){
		setTimeout(ComputerMove, 800);
	}
}

// Win Conditions
let winPattern = [
	[0,1,2],[3,4,5],[6,7,8],
	[0,3,6],[1,4,7],[2,5,8],
	[0,4,8],[2,4,6]
];

// Result Validation 
function handleResultValidation(){
	for(let i = 0; i < winPattern.length; i++){
		
		let a = winPattern[i][0];
		let b = winPattern[i][1];
		let c = winPattern[i][2];

		if(gameArray[a] !== "" && gameArray[a] === gameArray[b] && gameArray[b] === gameArray[c]){
			gameActive = false;

			//update score board
			const winner = gameArray[a];
			scores[winner]++;

			updateScoreboard();

			setTimeout( () => {
				alert(`Game Over. ${winner.toUpperCase()} won !`);
			}, 1000);

			return; // stop the loop after a win is detected.
		}
	}

	// Check for a draw(after win check.)
	if(!gameArray.includes("")){
		gameActive = false; //stop the board.
		scores.ties++; //increment the ties counter
		updateScoreboard();

		setTimeout( () => {
			alert(`Game Over. It's a draw!`);
		}, 1000);
		return;
	}	
}

//computer mark
function getComputerMark(){
	return selectedPlayer === 'x' ? 'o' : 'x';
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

				
				if(gameMode === 'computer' && currentPlayer === getComputerMark()){
					setTimeout(ComputerMove, 1000);
				}
			}
		}
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

	if(gameMode === 'computer' && currentPlayer === getComputerMark()){
		setTimeout(ComputerMove, 1000);
	}
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
		startGame();
		difficultyMenu.style.display = 'none';
	});
});

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

/*
/* Difficulty: Easy = Random computer
*/
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

	return move;
}

/* 
// Difficulty: Medium = SmartMove
*/
function SmartMove(){
	// Phase 1: Try to Win
	for(let pattern of winPattern){
		let [a, b, c] = pattern;
		let values = [gameArray[a], gameArray[b], gameArray[c]];

		let computerCount = values.filter(val => val === getComputerMark()).length;

		let emptycount = values.filter(val => val === "").length;

		if(computerCount === 2 && emptycount === 1){
			if(gameArray[a] === "") return a;
			if(gameArray[b] === "") return b;
			if(gameArray[c] === "") return c;
		}
	}
	//Phase 2: Try to Block
	for(let pattern of winPattern){
		let [a, b, c] = pattern;
		let values = [gameArray[a], gameArray[b], gameArray[c]];

		let opponentCount = values.filter(val => val === opponentMark()).length;

		let emptyCount = values.filter(val => val === "").length;

		if(opponentCount === 2 && emptyCount === 1){
			if(gameArray[a] === "") return a;
			if(gameArray[b] === "") return b;
			if(gameArray[c] === "") return c;
		}
	}
	return RandomMove();
}

//Opponent Mark function
function opponentMark(){
	return (selectedPlayer === 'x') ? 'o' : 'x';
}
// Score Board
function updateScoreboard(){
	//const opponentMark = (selectedPlayer === 'x') ? 'o' : 'x';
	document.getElementById('you-score').textContent = scores[selectedPlayer];
	document.getElementById('opponent-score').textContent = scores[opponentMark()];
	document.getElementById('ties-score').textContent = scores.ties;
}
