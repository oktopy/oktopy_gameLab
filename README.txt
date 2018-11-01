����������� ������ ��� ������������:

http://git.iipo.tu-bryansk.ru - ��� ����������� �� ������� �� ���������� �����������.
 https://habrahabr.ru/company/ruvds/blog/333856/ - MVC � JS. ���� �� ����� �������� ��������, ��� � �����




����. ������ ����� �������� ��������� ������ �������.
� ���� ������������ ������� MVC, ������� ��������� ����� ���������

assets/css/style.css - ����� ����� ������ ���� �� �������
assets/img - ����� ����� ������ ���� �������
assets/sounds - ����� ��� ������
js/marioController.js
js/marioModel.js
js/marioView.js
.gitignore
game.html
README.txt

������� title - � ���� ������ ������ ����������� mario.

��������� ������� �����.

� ��� ����� ����� ����� � �����, ��� ����� ������������� �����, �������� � ����.

<div class="mainScene">
    <div class="character"></div>
    <div class="goomba"></div>
</div>

��������� ���� ������.

������ �������� �����, ��� ������� ��������. �� ��� ����� ���. � ����� �������� Chrome � ������� ��� �� ������.
��� ����, ����� ���� ����� ������� ����� � ������ � ��������� ��� ��� ������ border. ����� ����� ������ ��� ����� � ������ � ������������� ���������� �� ������ �� �����������.

.mainScene {
    position: relative;
    border: 1px solid black;
    width: 800px;
    height: 600px;
    margin: 0 auto;
}

��������� ���� � �����. ������� ��� ������� �������� ����������. ������� � mainScene

background: linear-gradient(to bottom, rgba(0, 0, 255, 0.44) 75%, rgba(0, 128, 0, 0.65) 75%);

� ������ Border. �������. �� ���� ���� ��������� ���������. �������� �� ����� �� � ����� �����.

����� ����� ���������� ���� ����� �����. � ������� ���������� ��� ��������, ������� ����� ���� ���-�� � ��� ����� ��������.

.character {
    position: absolute;
    width: 30px;
    height: 40px;
    background-image: url(../img/mario.png);
    background-repeat:no-repeat;
    background-size: 100% 100%;
}

� �� ��� ������ ������ .png ����������. ��������� �� �� ���� ���� �����, �� ���� �������, �� .png ������������ ��� ���������� ���.

������� �� ����� �� ��� �����. ���� ���� ���� �������.

������ �������� ��������������� �� ������������ ������ ���������. 
��� ������ ��������� � ��� head ��� ���� �������

<script src="js/marioModel.js"></script>
<script src="js/marioView.js"></script>
<script src="js/marioController.js"></script>
	
����, ������ � ������. ���� ��� � ��� �� ������ ����� ���������� ������ ���� �����, � ��� ��� ����� ��� ��� �����������? 
��� ��������� ����������, ��� �� ���������� �� ������� ���� � ��� ������� ����������. 

����� �������, ��� ������� ������� � ������� �����, ����� �� ������ � �������� ���������. ����� � �� ���� ������������ ES6, ������� ���� ������ function �������� ������. 

����, ��������� ���������� ������ ����� 0, 0. �� ��������, ��� ������ �� ������ ������ ������. ��� ��� �� ����� ���������� view - ��� ����� �� �����.
����� ����������� ��������. ��� ������ ������� ���, ����� �� ����� 

/*

Mario model

*/

const INITIAL_MARIO_X = 0;
const INITIAL_MARIO_Y = 0;
const INITIAL_GOOMBA_X = -200;
const INITIAL_GOOMBA_Y = 0;
const LAND = 0;
const LEFT_BORDER = -400;
const RIGHT_BORDER = 370;

var Model = function () {
    this.objs = {
        'mario': {
            x: INITIAL_MARIO_X,
            y: INITIAL_MARIO_Y
        }
    };
};

Model.prototype.init = function(renderFunction){
    this.needRendering = renderFunction;
};

Model.prototype.setCoords = function (obj, x, y) {
    x = x == (undefined || null) ? obj.x : x;
    y = y == (undefined || null) ? obj.y : y;

    checkScreenBorders.call(this, obj, x);

    this.needRendering();
};

Model.prototype.getCoords = function (obj) {
    return {
        x: obj.x,
        y: obj.y
    }
};

Model.prototype.marioMove = function(e){
    var keyCode = e.keyCode;
    var x = marioModel.getCoords(marioModel.objs.mario).x;

    switch (keyCode) {
        case KEY_CODE_RIGHT: {
            marioModel.setCoords(marioModel.objs.mario, x + MARIO_STEP);
            break;
        }
        case KEY_CODE_LEFT: {
            marioModel.setCoords(marioModel.objs.mario, x - MARIO_STEP);
            break;
        }
    }
};

function checkScreenBorders(obj, x) {
    if (!(x <= LEFT_BORDER || x >= RIGHT_BORDER)) {
        obj.x = x;
    }
    else {
        if (obj.hasOwnProperty('direction')) {
            obj.direction = obj.direction === 'right' ? 'left' : 'right';
        }
    }
}

var marioModel = new Model();



������ ������

/*

Mario view

*/

var View = function() {
    this.mario = document.querySelector('.character');
    this.goomba = document.querySelector('.goomba');

    this.onKeyDownEvent = null;
};

View.prototype.render = function (objs) {
    this.mario.style.left = 'calc(50% + ' + objs.mario.x + 'px)';
    this.mario.style.top = 'calc(68.5% + ' + objs.mario.y + 'px)';
};

View.prototype.init = function (){
    document.addEventListener('keydown', this.onKeyDownEvent);
};

var marioView = new View();

�, �������, ����������

/*

Mario controller

*/

var Controller = function (View, Model) {
    this.marioView = View;
    this.marioModel = Model;
};

Controller.prototype.init = function() {
    this.marioView.onKeyDownEvent = this.moving.bind(this);

    this.marioView.init();
    this.marioModel.init(this.needRendering.bind(this));
    this.needRendering();
};

Controller.prototype.moving = function(e) {
    this.marioModel.marioMove(e);
};

Controller.prototype.needRendering = function(){
    this.marioView.render(marioModel.objs);
};

var marioController = new Controller(marioView, marioModel);

marioController.init();

������ ��. � ��� ���� �����, ������� ����� ������. 

������� ������� ���, ����� � ��� ��� �������� �������� ������ ������ �� �����. ����� ��, ��� ��� ������ �� �����������, ��������� ��� ���� ����� ������� ������.
�� �������� ��� �������� ������.

� ����� sounds � ���� ����� ������� �������������� mp3 ����.

������ � html ���������

<audio loop autoplay>
    <source src="assets/sounds/main.mp3" type="audio/mp3" />
</audio>

� ������ ��� �������� �������� ����� �� ����� ��������� � ���������������� ��� ����.

������� ������ � ������� � ��� ���� �������� �������������. 

� ��� html ������� ��� ���� ����� �������, ������� �������� ��� �������������� ������.

<audio class="jump">
    <source src="assets/sounds/jump.mp3" type="audio/mp3" />
</audio>

��������, � ���� ��� ���������� loop � autoplay.

������� ��������� ������ �� ����� �� View � ���� ������ ������ ��������� ���

var View = function() {
    this.mario = document.querySelector('.character');
    this.goomba = document.querySelector('.goomba');
    this.jumpSound = document.querySelector('.jump');

    this.onKeyDownEvent = null;
    this.onClickJumpEvent = null;
};

View.prototype.init = function (){
    document.addEventListener('keydown', this.onKeyDownEvent);
    document.addEventListener('click', this.onClickJumpEvent);
};

View.prototype.render = function (objs) {
    this.mario.style.left = 'calc(50% + ' + objs.mario.x + 'px)';
    this.mario.style.top = 'calc(68.5% + ' + objs.mario.y + 'px)';

    this.goomba.style.left = 'calc(50% + ' + objs.goomba.x + 'px)';
    this.goomba.style.top = 'calc(70% + ' + objs.goomba.y + 'px)';
};

var marioView = new View();

������ ���� � ����������. ��� ���������� �������� ������, ��� �� �������. 

� init 
	this.marioView.onClickJumpEvent = this.jumping.bind(this);

� ������ �������, ������� ����� �������� ������, ��� ���� ������ ������������ ������

Controller.prototype.jumping = function() {
    this.marioModel.initMarioJump(this.marioView.jumpSound);
};

� ��������, ��� ����� ����������� ������.
��� �������� ������ � ���� ������������ RequestAnimationFrame. 
������� � �������� �����. ��� �������� ���� ����, �� ��� ���, ���� �� ���������� ������������ �������.
��� ����� ��� ���� ��� ��������� ��������������� �������. ����� ��� ����������� �� �������, � �.�. ������ � ��������� ����������� �����������. ��, ����� ����� ���.

���� � ������. ��������� ��������������� �������.

Model.prototype.isBusy = function () {
    return this.busy;
};

Model.prototype.changeBusy = function () {
    this.busy = !this.busy;
};

Model.prototype.isUp = function () {
    return this.up;
};

Model.prototype.changeUp = function () {
    this.up = !this.up;
};

Model.prototype.isJumpEnd = function () {
    return this.endJump;
};

Model.prototype.changeJumpEnd = function () {
    this.endJump = !this.endJump;
};

�������������� ��� ���������� � ������������

this.busy = false;
this.up = true;
this.endJump = false;

������� � setCoords �������� �� ������

if (y !== obj.y) {
	checkEndJump.call(this, obj, y);
}

Model.prototype.initMarioJump = function (sound) {
    if (!marioModel.isBusy()) {
        marioModel.changeBusy();
        requestAnimationFrame(marioModel.marioJump);
        sound.play();
    }
};

Model.prototype.marioJump = function(){
    var y = marioModel.getCoords(marioModel.objs.mario).y;
    if (marioModel.isUp()) {
        marioModel.setCoords(marioModel.objs.mario, null, y - MARIO_STEP);
    }
    else {
        marioModel.setCoords(marioModel.objs.mario, null, y + MARIO_STEP);
    }
    if (marioModel.isJumpEnd()) {
        marioModel.changeBusy();
        marioModel.changeJumpEnd();
        marioModel.changeUp();
        cancelAnimationFrame(MarioID);
    }
    else {
        requestAnimationFrame(marioModel.marioJump);
    }
};

������� � �� �� ���� ����� �������. 

�, ������� �������� ��� ������ goomba.

��� �� �� � ������, �� ������ � ��

� ������� init

GoombaID = requestAnimationFrame(this.walkingGoomba);
	
� ������� �������� ��� ��� �����������

Model.prototype.checkMarioGoombaCollision = function (mario, goomba) {
    var marioLeft = mario.getBoundingClientRect().left;
    var marioRight = mario.getBoundingClientRect().right;
    var marioY = this.objs.mario.y;
    var goombaLeft = goomba.getBoundingClientRect().left;
    var goombaRight = goomba.getBoundingClientRect().right;
    var goombaY = this.objs.goomba.y;

    if (goombaLeft < marioLeft && marioLeft < goombaRight ||
        goombaLeft < marioRight && marioRight < goombaRight) {
        if (goombaY - marioY >= KILLER_HEIGHT && goombaY - marioY < GOOMBA_HEIGHT) {
            return 'kill';
        }
        else if (goombaY - marioY < KILLER_HEIGHT) {
            return 'die'
        }
    }
    return false;
};

Model.prototype.walkingGoomba = function () {
    var x = marioModel.getCoords(marioModel.objs.goomba).x;

    if (marioModel.objs.goomba.direction === 'right') {
        marioModel.setCoords(marioModel.objs.goomba, x + GOOMBA_STEP);
    }
    else {
        marioModel.setCoords(marioModel.objs.goomba, x - GOOMBA_STEP);
    }
    var collision = marioModel.checkMarioGoombaCollision(marioView.mario, marioView.goomba);
    if (collision === 'kill') {
        // cancelAnimationFrame(GoombaID);
        marioController.dieGoomba();
    }
    else if (collision === 'die'){
        marioController.dieMario();
        requestAnimationFrame(marioModel.walkingGoomba);
    }
    else if (!collision) {
        requestAnimationFrame(marioModel.walkingGoomba);
    }
};

������� ������ ��� �������� ������ ������

function checkScreenBorders(obj, x) {
    if (!(x <= LEFT_BORDER || x >= RIGHT_BORDER)) {
        obj.x = x;
    }
    else {
        if (obj.hasOwnProperty('direction')) {
            obj.direction = obj.direction === 'right' ? 'left' : 'right';
        }
    }
}

� ������� �� view ��� ������� ������� "�������" � �� ����� ���� �������� ��� ����� ��� �����, ���� ����������� ����� ���� ��������� ��������������� �������

Controller.prototype.dieMario = function() {
    this.marioView.mario.setAttribute('hidden', 'true');

    this.marioView.render(marioModel.objs);
};

Controller.prototype.dieGoomba = function() {
    this.marioView.goomba.setAttribute('hidden', 'true');

    this.marioView.render(marioModel.objs);
};







	
	
	
	
	
	
	
	
	
	
	
	
	
	




