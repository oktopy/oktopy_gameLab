/*

saper view

*/
var onVeryFirstClick = true;
var res = 'http://www.w3.org/2000/svg';

var View = function() {
	this.jumpSound = document.querySelector('.jump');
	var svg = document.getElementById('svgid');
    for (var i = 0; i < 10; i++) {
        for(var j = 0; j < 10; j++) {
			var rect = document.createElementNS(res, 'rect');
			var fieldText = document.createElementNS(res, 'text');
			var xpos = 10 + 45*j;
			var ypos = 10 + 45 * i;
			var textposx = xpos + 10;
			var textposy = ypos + 30;
					
			rect.setAttributeNS(null, 'width', '40');
			rect.setAttributeNS(null, 'height', '40');
			rect.setAttributeNS(null, 'x', xpos);
			rect.setAttributeNS(null, 'y', ypos);
			rect.setAttributeNS(null, 'height', '40');
			rect.setAttributeNS(null, 'fill', 'gray'); 
			rect.setAttributeNS(null, 'stroke-width', '3'); 
			rect.setAttributeNS(null, 'stroke', 'black'); 

			fieldText.setAttributeNS(null, 'y', textposy); 
			fieldText.setAttributeNS(null, 'x', textposx); 
			fieldText.setAttributeNS(null, 'font-size', '30'); 
			fieldText.setAttributeNS(null, 'font-weight', 'bold'); 
			
			rect.id = 'id_' + i + '_' + j;
			fieldText.id = 'idt_' + i + '_' + j;
			rect.oncontextmenu = this.onDoubleclick;
            rect.onclick = this.onClick;
			
			
			svg.appendChild(rect);
			svg.appendChild(fieldText);
        }
    }
};

View.prototype.onClick = function(){
	saperController.jumping();
	var t = this.id;
	var t1 = t.split('_');
	var txtid = 'idt_'+ t1[1]+ '_' + t1[2];
	var txt = document.getElementById(txtid);
	if(onVeryFirstClick)
	{
		saperController.GenerateField();
		while (saperController.getMatrix(t1[1],t1[2]) == '1')
		{
			saperController.GenerateField();
		}
		onVeryFirstClick = false;
	}
	
	if(saperController.getMatrix(t1[1],t1[2]) == '1')
	{
		this.setAttributeNS(null, 'fill', 'red');
		var a = confirm('YOU LOSE! GOOD DAY,SIR!');
		if (a)
			location.reload();
	}
	else
	{
		this.setAttributeNS(null, 'fill', 'green');
		txt.innerHTML = saperController.getBombs(t1[1],t1[2]);
	}
}

View.prototype.onDoubleclick = function(e){
	e.preventDefault();
	if (this.getAttribute("fill") == "gray")
	{
		this.setAttributeNS(null, 'fill', 'yellow');
	}
	else if (this.getAttribute("fill") == "yellow")
	{
		this.setAttributeNS(null, 'fill', 'gray');
	}
}

var saperView = new View();
