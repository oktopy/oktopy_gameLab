/*

saper view

*/
var onVeryFirstClick = true;

var View = function() {
	this.jumpSound = document.querySelector('.jump');
	var table = document.createDocumentFragment();
    for (var i = 0; i < 10; i++) {
        var tr = document.createElement('tr');
        for(var j = 0; j < 10; j++) {
            var td = document.createElement('td');
            var bl = document.createElement('div');
						bl.className='commonBlock';
            bl.id = 'id_' + i + '_' + j;
			
			bl.oncontextmenu = this.onDoubleclick;
            bl.onclick = this.onClick;
			
            td.appendChild(bl);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    document.getElementById('matrix').appendChild(table);
};

View.prototype.onClick = function(){
	
	
	saperController.jumping();
	var t = this.id;
	var t1 = t.split('_');
	
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
		this.className = 'explodedBlock';
		var a = confirm('YOU LOSE! GOOD DAY,SIR!');
		if (a)
			location.reload();
	}
	else
	{
		this.className = 'openedBlock';
		this.innerHTML = saperController.getBombs(t1[1],t1[2]);
	}
}

View.prototype.onDoubleclick = function(e){
	e.preventDefault();
	if (this.className == 'commonBlock')
	{
		this.className = 'wedontknowBlock';
	}
	else if (this.className == 'wedontknowBlock')
	{
		this.className = 'commonBlock';
	}
}

var saperView = new View();
