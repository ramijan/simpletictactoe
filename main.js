var app = angular.module('simpleTTT', ['firebase']);

app.controller('tttController', ['$scope', '$firebase', function($scope, $firebase){

	// Function links to firebase and returns data as an object
	function getFirebaseGame() {
		var ref = new Firebase('https://rami-tictactoe.firebaseio.com/simpleTTT');
		var game = $firebase(ref).$asObject();
		return game;
	}

	// call firebase function and save object in $scope.game
	$scope.game = getFirebaseGame();
	// make variable 'g' same as $scope.game (easier to type)
	var g = $scope.game;

	// Initialization code.  Check if game needs player 2 and then assign
	// player accordingly.  If player 1, initialize game board.
	$scope.player = '';
	g.$loaded().then(function() {
		if(g.needPlayerTwo) {
			$scope.player = 2;
			g.needPlayerTwo = false;
		}
		else {
			$scope.player = 1;
			g.needPlayerTwo = true;
			g.board = [['','',''],['','',''],['','','']];
			g.playerTurn = 1;
			g.winner = false;
		}
		g.$save();
	});


	// Play function is called whenever player clicks on tictactoe board
	// It validates the move and then assigns player's token to that square
	// and finally checks for game over
	$scope.play = function(row, col) {
		//don't allow moves when game is over
		if(g.winner) {
			return;
		}

		if(g.board[row][col] === '' && $scope.player === 1 && g.playerTurn === 1) {
			g.board[row][col] = 'X';
			g.playerTurn = 2;
		}
		else if(g.board[row][col] === '' && $scope.player === 2 && g.playerTurn === 2) {
			g.board[row][col] = 'O';
			g.playerTurn = 1;
		}

		g.winner = checkGameOver();
		g.$save();
	};

	// Resets the game (linked to reset button in html for easy restarts)
	$scope.resetGame = function() {
		g.board = [['','',''],['','',''],['','','']];
		g.playerTurn = 1;
		g.winner = false;
		g.$save();
	};

	// Called by play() function.  Checks for game over states and returns
	// the winning token, or "tie" for a tie.
	// if the game is not over, returns false.
	function checkGameOver() {
		//check rows
		for(var i = 0; i < 3; i++) {
			if(g.board[i][0] !== '' && g.board[i][0] == g.board[i][1] && g.board[i][1] == g.board[i][2]) {
				return g.board[i][0];
			}
		}
		//check columns
		for(var j = 0; j < 3; j++) {
			if(g.board[0][j] !== '' && g.board[0][j] == g.board[1][j] && g.board[1][j] == g.board[2][j]) {
				return g.board[0][j];
			}
		} 
		//check diagonals
		if(g.board[0][0] !== '' && g.board[0][0] == g.board[1][1]  && g.board[1][1] == g.board[2][2]) {
			return g.board[0][0];
		}
		if(g.board[0][2] !== '' && g.board[0][2] == g.board[1][1] && g.board[1][1] == g.board[2][0]) {
			return g.board[0][2];
		}
		//check for empty squares
		for(i = 0; i < 3; i++) {
			for(j = 0; j < 3; j++) {
				if(g.board[i][j] === '') {
					return false;
				}
			}
		}
		//if the function gets this far, it's a tie
		return 'tie';
	}

}]);