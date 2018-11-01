/*

saper view

*/
var onVeryFirstClick = true;
var coloredMatrix = Array.apply(null, Array(100)).map(Number.prototype.valueOf,0);

var View = function() {
	this.jumpSound = document.querySelector('.jump');
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	canvas.addEventListener('click', this.clicked);
	canvas.addEventListener('contextmenu', this.clicked);
	
	this.redraw(ctx);	
};

View.prototype.clicked = function(evt){
	saperController.jumping();
	evt.preventDefault();
	var x = evt.pageX - evt.target.offsetLeft,
		y = evt.pageY - evt.target.offsetTop;
	if(onVeryFirstClick)
	{
		saperController.GenerateField();
		for (var i = 0; i < 10; i++) {
			for(var j = 0; j < 10; j++) {
				xpos = 5 + j * 45;
				ypos = 5 + i * 45;
				if (x > xpos && x < xpos + 40 && y > ypos && y < ypos+40)
				{
					while(saperController.getMatrix(i,j) == '1')
					{
						saperController.GenerateField();
					}	
				}
			}
		}
		onVeryFirstClick = false;
	}
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, 1000, 1000);
		
	
	for (var i = 0; i < 10; i++) {
		for(var j = 0; j < 10; j++) {
			xpos = 5 + j * 45;
			ypos = 5 + i * 45;
			if (x > xpos && x < xpos + 40 && y > ypos && y < ypos+40)
			{
				if (coloredMatrix[j+i*10] == 0)
				{
					if(evt.button == 0) {
						if(saperController.getMatrix(i,j) == '1')
						{
							coloredMatrix[j+i*10] = 1;
							var a = confirm('YOU LOSE! GOOD DAY,SIR!');
							if (a)
								location.reload();
						}	
						else if (saperController.getMatrix(i,j) == '0')
						{
							coloredMatrix[j+i*10] = 2;
						}	
					}
					if(evt.button == 2)
					{
						if(coloredMatrix[j+i*10] == 0)
						{
							coloredMatrix[j+i*10] = 3;
						}	
						else if (coloredMatrix[j+i*10] == 3)
						{
							coloredMatrix[j+i*10] = 0;
						}	
					}
				}
				
			}
			if (coloredMatrix[j+i*10] == 1)
				ctx.fillStyle = 'red';
			else if(coloredMatrix[j+i*10] == 2)
				ctx.fillStyle = 'green';
			else if(coloredMatrix[j+i*10] == 3)
				ctx.fillStyle = 'yellow';
			else
				ctx.fillStyle = 'gray';
			
			ctx.strokeRect(xpos,ypos, 40,40);		
				ctx.fillRect(xpos,ypos,40,40);
		}
	}
	
	ctx.fillStyle = 'black';
	ctx.font = "30px Arial";
	for (var i = 0; i < 10; i++) {
		for(var j = 0; j < 10; j++) {
			if(coloredMatrix[j+i*10] == 2)
			{
				xpos = 5 + j * 45;
				ypos = 5 + i * 45;
				ctx.fillText(saperController.getBombs(i,j),xpos + 10,ypos+30);
			}
		}
	}
}

View.prototype.redraw = function(ctx)
{
	for (var i = 0; i < 10; i++) {
        for(var j = 0; j < 10; j++) {
			ctx.strokeStyle = 'black';
			ctx.lineWidth = '4';
			ctx.strokeRect(5 + j * 45,5 + i * 45, 40, 40);
			ctx.fillStyle = 'gray';
			ctx.fillRect(5 + j * 45,5 + i * 45,40,40);
        }
    }
}

var saperView = new View();
