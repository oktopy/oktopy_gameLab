НЕОБХОДИМЫЕ ССЫЛКИ ДЛЯ ЛАБОРАТОРНЫХ:

http://git.iipo.tu-bryansk.ru - гит репозиторий на который всё необходимо выкладывать.
 https://habrahabr.ru/company/ruvds/blog/333856/ - MVC в JS. Один из самых понятных примеров, что я нашел




Итак. Первым делом создадим структуру нашего проекта.
Я буду использовать паттерн MVC, поэтому структура будет следующая

assets/css/style.css - Здесь будет лежать файл со стилями
assets/img - Здесь будут лежать наши спрайты
assets/sounds - Папка для звуков
js/marioController.js
js/marioModel.js
js/marioView.js
.gitignore
game.html
README.txt

Зададим title - я буду делать совсем простенький mario.

Сверстаем главную сцену.

У нас будет общая сцена с фоном, где будет располагаться земля, персонаж и гриб.

<div class="mainScene">
    <div class="character"></div>
    <div class="goomba"></div>
</div>

Подключим файл стилей.

Покажу основные приёмы, как удобнее верстать. Ну это лично мне. Я сразу открываю Chrome и начинаю там всё делать.
Для того, чтобы были видны границы блока я нахожу и выставляю ему для начала border. Затем задаю нужную мне длину и ширину и автоматически выравниваю по центру по горизонтали.

.mainScene {
    position: relative;
    border: 1px solid black;
    width: 800px;
    height: 600px;
    margin: 0 auto;
}

Стилизуем небо и землю. Сделаем это простым линейным градиентом. Добавим в mainScene

background: linear-gradient(to bottom, rgba(0, 0, 255, 0.44) 75%, rgba(0, 128, 0, 0.65) 75%);

И уберем Border. Обновим. На этом наши украшения закончены. Украсить мы можем всё в любое время.

Пусть нашим персонажем пока будет марио. Я заранее подготовил его спрайтик, поэтому пусть хоть что-то у нас будет красивое.

.character {
    position: absolute;
    width: 30px;
    height: 40px;
    background-image: url(../img/mario.png);
    background-repeat:no-repeat;
    background-size: 100% 100%;
}

Я не зря выбрал именно .png расширение. Поговорим мы об этом чуть позже, но если вкратце, то .png обеспечивает нам прозрачный фон.

Опустим на землю мы его потом. Пока наше дело сделано.

Теперь примемся непосредственно за передвижения нашего персонажа. 
Для начала подключим в наш head три наши скрипта

<script src="js/marioModel.js"></script>
<script src="js/marioView.js"></script>
<script src="js/marioController.js"></script>
	
Итак, начнем с модели. Пока что у нас на экране будет находиться только один марио, а что нам нужно для его отображения? 
Его дефолтные координаты, где он появляется со стартом игры и его текущие координаты. 

Имена классов, как правило пишутся с большой буквы, чтобы не путать с обычными функциями. Здесь я не буду использовать ES6, поэтому пишу просто function объявляя объект. 

Итак, начальные координаты нашего Марио 0, 0. Не забываем, что сейчас мы задаем просто модель. Как это всё будет отображать view - это здесь не важно.
Будем действовать поэтапно. Для начала сделаем так, чтобы он бегал 

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



Теперь вьюшка

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

И, наконец, контроллер

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

Теперь всё. У нас есть марио, который может бегать. 

Давайте сделаем там, чтобы у нас при загрузке начинала играть музыка из марио. Опять же, вам это делать не обязательно, поскольку это тема более поздних лекций.
Но делается это довольно просто.

В папке sounds у меня лежит заранее подготовленный mp3 файл.

Просто в html добавляем

<audio loop autoplay>
    <source src="assets/sounds/main.mp3" type="audio/mp3" />
</audio>

И теперь при загрузке страницы сразу же будет грузиться и воспроизводиться наш файл.

Сделаем прыжки и добавим к ним тоже звуковое сопровождение. 

В наш html добавим ещё один аудио элемент, который позволит нам воспроизводить прыжок.

<audio class="jump">
    <source src="assets/sounds/jump.mp3" type="audio/mp3" />
</audio>

Заметьте, у него нет параметров loop и autoplay.

Добавим обработку прыжка по клику во View и наша вьюшка примет следующий вид

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

Теперь идем в контроллер. Нам необходимо сообщить моделе, что мы прыгаем. 

В init 
	this.marioView.onClickJumpEvent = this.jumping.bind(this);

И просто функцию, которая будет сообщать моделе, что надо начать просчитывать прыжок

Controller.prototype.jumping = function() {
    this.marioModel.initMarioJump(this.marioView.jumpSound);
};

И пропишем, как будем анимировать прыжок.
Для анимации прыжка я буду использовать RequestAnimationFrame. 
Принцип её действия прост. Она вызывает саму себя, до тех пор, пока не выполнится определенное условие.
Для этого нам надо ещё несколько вспомогательных функций. Можно это реализовать по разному, в т.ч. просто с постоянно действующей гравитацией. Но, пусть будет так.

Идем в модель. Добавляем вспомогательные функции.

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

Инициализируем эти переменные в конструкторе

this.busy = false;
this.up = true;
this.endJump = false;

Добавим в setCoords проверку на прыжок

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

Обновим и мы на клик можем прыгать. 

И, добавим движения для нашего goomba.

Раз уж мы в модели, то начнем с неё

В функцию init

GoombaID = requestAnimationFrame(this.walkingGoomba);
	
и сделаем анимацию для его перемещения

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

Сделаем апдейт для проверки границ экрана

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

и добавим во view две функции которые "убивают" а на самом деле скрывают или марио или гумбу, если пересечение между ними случается соответствующим образом

Controller.prototype.dieMario = function() {
    this.marioView.mario.setAttribute('hidden', 'true');

    this.marioView.render(marioModel.objs);
};

Controller.prototype.dieGoomba = function() {
    this.marioView.goomba.setAttribute('hidden', 'true');

    this.marioView.render(marioModel.objs);
};







	
	
	
	
	
	
	
	
	
	
	
	
	
	




