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

//Event Delegation
const gameTable = document.querySelector('.game-table');

gameTable.addEventListener('click', (e) => {
	//console.log(e);
	if(e.target.classList.contains('game-cell')){

		let cellNumber = parseInt(e.target.dataset.index);

		console.log('Cell clicked:', cellNumber);
		
		if(gameArray[cellNumber] == 'x' || gameArray[cellNumber] == 'o'){
			console.log("aye aye Captain");
		}else{
			gameArray[cellNumber] = currentPlayer;
			e.target.textContent = currentPlayer;
			currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
		}
		
	}
	console.log(gameArray);
});

console.log(gameArray);

