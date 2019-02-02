var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

/*
Background
*/
function Background(game, spritesheet, x, y, speed) {
    this.animation = new Animation(spritesheet, 3072, 1536, 1, 0.1, 1, true, 0.5);
    this.speed = speed;
    this.ctx = game.ctx;
    Entity.call(this, game, x, y);
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
    this.x -= this.game.clockTick * this.speed;
    if (this.x <= -1536) this.x = 1530;
    Entity.prototype.update.call(this);
}

Background.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

function Ken(game, spritesheet) {
    this.animation = new Animation(spritesheet, 70, 80, 4, 0.25, 4, false, 1.5);
    this.x = 25;
    this.y = 25;
    this.speed = 100;
    this.game = game;
    this.ctx = game.ctx;
}

Ken.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);

}

Ken.prototype.update = function () {
	var duration = this.animation.elapsedTime / this.animation.totalTime;
	if (duration > 0.8) {
		this.animation.elapsedTime = 0;
		console.log("Hadouken!");
		this.game.addEntity(new Fireball(this.game, AM.getAsset("./img/fireball.png"), 75, 35));
	}
}

/*
Bouncing Asteroid
*/
function Asteroid(game, spritesheet) {
    this.animation = new Animation(spritesheet, 72, 72, 5, 0.10, 19, true, 1);
    this.speed = 400;
    this.ctx = game.ctx;
    this.xMultiplier = -1;
    this.yMultiplier = 1;
    Entity.call(this, game, 700, 80);
}

Asteroid.prototype = new Entity();
Asteroid.prototype.constructor = Asteroid;

Asteroid.prototype.update = function () {
    this.x += this.game.clockTick * this.speed * this.xMultiplier;
    this.y += this.game.clockTick * this.speed * this.yMultiplier;
    
    // Check for borders and reverse direction
    if (this.y > 628)  {
        this.yMultiplier = -1;
    } else if (this.y < 0)  {
        this.yMultiplier = 1;
    } else if (this.x < 0)  {
        this.xMultiplier = 1;
    } else if (this.x > 728)  {
        this.xMultiplier = -1;
    }
    Entity.prototype.update.call(this);
}

Asteroid.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

/*
Spearguy Death
*/
function SpearGuy(game, spritesheet) {
    this.animation = new Animation(spritesheet, 120, 100, 5, 0.08, 17, true, 1.5);
    this.speed = 200;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 150);
}

SpearGuy.prototype = new Entity();
SpearGuy.prototype.constructor = SpearGuy;

SpearGuy.prototype.update = function () {
}

SpearGuy.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

/*
Hopping Rabbit
*/
function Rabbit(game, spritesheet) {
    this.animation = new Animation(spritesheet, 200, 238, 8, 0.10, 8, true, 0.75);
    this.speed = 200;
    this.ctx = game.ctx;
    this.startY = 300;
    Entity.call(this, game, 0, 325);
}

Rabbit.prototype = new Entity();
Rabbit.prototype.constructor = Rabbit;

Rabbit.prototype.update = function () {
    // stagger x movement to coincide with hop.  Also change y when hopping
    if ((this.animation.elapsedTime >= this.animation.totalTime * 2/ 8) && (this.animation.elapsedTime < this.animation.totalTime * 6 / 8)) {
        this.x += this.game.clockTick * this.speed;
        if (this.animation.elapsedTime < this.animation.totalTime * 4 / 8)
            this.y -= this.game.clockTick * this.speed * 1.5;
        else
            this.y += this.game.clockTick * this.speed * 1.5;
    }
        
    if (this.x > 800) this.x = -230;
    Entity.prototype.update.call(this);
}


Rabbit.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

/*
Running Soldier
*/
function Soldier(game, spritesheet) {
    this.animation = new Animation(spritesheet, 50, 50, 8, 0.10, 8, true, 2);
    this.speed = 200;
    this.ctx = game.ctx;
	this.game = game;
    Entity.call(this, game, 0, 520);
}

Soldier.prototype = new Entity();
Soldier.prototype.constructor = Soldier;

Soldier.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;
    if (this.x > 800) this.x = -230;
    Entity.prototype.update.call(this);
}

Soldier.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

/*
Fireball
*/
function Fireball(game, spritesheet, x, y) {
    this.animation = new Animation(spritesheet, 70, 80, 2, 0.08, 2, true, 1);
	this.explodeAnimation = new Animation(AM.getAsset("./img/explode.png"), 70, 80, 4, 0.10, 4, false, 1);
    this.speed = 400;
    this.ctx = game.ctx;
	this.x = x;
	this.y = y;
    Entity.call(this, game, x+37, y);
}

Fireball.prototype = new Entity();
Fireball.prototype.constructor = Fireball;

Fireball.prototype.update = function () {
	if (this.x < 755) this.x += this.game.clockTick * this.speed;

    Entity.prototype.update.call(this);
}

Fireball.prototype.draw = function () {
	if (this.x < 755) this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    else {
		this.explodeAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
		if (this.explodeAnimation.isDone()) {
			console.log("boom!");
			this.removeFromWorld = true;
		}
	} 
	Entity.prototype.draw.call(this);
}

/*
Camera
*/
var camera = {
    x: 0,
    y: 0,
    width: 800,
    height: 700};
    
/*
Running Wolf
*/
function Wolf(game, spritesheet) {
    this.animation = new Animation(spritesheet, 772, 413, 17, 0.05, 17, true, 0.25);
    this.speed = 250;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 600);
}

Wolf.prototype = new Entity();
Wolf.prototype.constructor = Wolf;

Wolf.prototype.update = function () {

    this.x += this.game.clockTick * this.speed;
    if (this.x > 800) this.x = -230;
    if (this.animation.elapsedTime >= this.animation.totalTime) {
        this.animation.elapsedTime = (this.animation.totalTime * (5 /17));
        this.animation.currentFrame = this.frameDuration * 5;
    }
    Entity.prototype.update.call(this);
}

Wolf.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

AM.queueDownload("./img/ken.png");
AM.queueDownload("./img/speardeath.png");
AM.queueDownload("./img/soldier.png");
AM.queueDownload("./img/rabbithop.png");
AM.queueDownload("./img/asteroid.png");
AM.queueDownload("./img/wolfrun.png");
AM.queueDownload("./img/layer1.png");
AM.queueDownload("./img/layer2.png");
AM.queueDownload("./img/layer3.png");
AM.queueDownload("./img/fireball.png");
AM.queueDownload("./img/explode.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/layer1.png"), 0, 0, 35));
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/layer1.png"), 1535, 0, 35));
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/layer2.png"), 0, -50, 75));
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/layer2.png"), 1535, -50, 75));
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/layer3.png"), 0, -50, 200));
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/layer3.png"), 1535, -50, 200));
    gameEngine.addEntity(new Asteroid(gameEngine, AM.getAsset("./img/asteroid.png")));
    gameEngine.addEntity(new Ken(gameEngine, AM.getAsset("./img/ken.png")));
    gameEngine.addEntity(new SpearGuy(gameEngine, AM.getAsset("./img/speardeath.png")));
    gameEngine.addEntity(new Rabbit(gameEngine, AM.getAsset("./img/rabbithop.png")));
    gameEngine.addEntity(new Soldier(gameEngine, AM.getAsset("./img/soldier.png")));
    gameEngine.addEntity(new Wolf(gameEngine, AM.getAsset("./img/wolfrun.png")));

    console.log("All Done!");
});