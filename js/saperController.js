/*

saper controller

*/

var Controller = function (View, Model) {
    this.saperView = View;
    this.saperModel = Model;
};

Controller.prototype.init = function() {
	
};

Controller.prototype.jumping = function() {
    this.saperModel.initsaperClick(this.saperView.jumpSound);
};

Controller.prototype.getMatrix = function(i,j) {
    return this.saperModel.getMatrix(i,j);
};

Controller.prototype.getBombs = function(i,j) {
    return this.saperModel.getBombs(i,j);
};

Controller.prototype.GenerateField = function() {
    return this.saperModel.GenerateField();
};


var saperController = new Controller(saperView, saperModel);

saperController.init();