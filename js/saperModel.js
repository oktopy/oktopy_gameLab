/*

saper model

*/
var gameMatrix =[];
var bombMatrix =[];
	
var Model = function () {
	
 
};

Model.prototype.GenerateField = function () {
       for (var i = 0; i < 10; i++) {
        gameMatrix[i] = [];
        for(var j = 0; j < 10; j++) {
            gameMatrix[i][j] = getRandom();
        }
    }
	for (var i = 0; i < 10; i++){
		bombMatrix[i] = [];
		var bombs = 0;
		for (var j = 0; j < 10; j++){
			if(gameMatrix[i][j] != 1)
			{
			if ( i > 0)
				if (gameMatrix[i-1][j] == 1){
					bombs ++;
				}
			if ( j > 0)
				if (gameMatrix[i][j-1] == 1){
					bombs ++;
				}
			if ( i < 9)
				if (gameMatrix[i+1][j] == 1){
					bombs ++;
				}
			if ( j < 9)
				if (gameMatrix[i][j+1] == 1){
					bombs ++;
				}
			if ( i > 0 && j > 0)
				if (gameMatrix[i-1][j-1] == 1){
					bombs ++;
				}
			if ( i < 9 && j > 0 )
				if (gameMatrix[i+1][j-1] == 1){
					bombs ++;
				}
			if ( i > 0 && j < 9)
				if (gameMatrix[i-1][j+1] == 1){
					bombs ++;
				}
			if ( i < 9 && j < 9)
				if (gameMatrix[i+1][j+1] == 1){
					bombs ++;
				}
				
			}
			bombMatrix[i][j] = bombs;
				var bombs = 0;
		}
	}
};

Model.prototype.initsaperClick = function (sound) {
    sound.play();
};

Model.prototype.getMatrix = function (i,j) {
    return gameMatrix[i][j];
};

Model.prototype.getBombs = function (i,j) {
    return bombMatrix[i][j];
};


function getRandom(){
    var min = 0;
    var max = 2;
    return Math.floor(Math.random()*(max-min))+min;
}

var saperModel = new Model();