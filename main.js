var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-wrap', { preload: preload, create: create, update: update });

function preload () {

    // http://chronicles0.deviantart.com/art/Bagel-Sprite-105754977
    game.load.spritesheet('bagel', 'assets/bagel_spritesheet.png', 32, 32);

    // http://s1229.photobucket.com/user/hercampusemory/media/Baguette_Parisienne_530_g___66_cm.png.html
    game.load.image('breadstick', 'assets/baguette_600.png');

    // Jimp/Turn Based Game/Backgrounds/bg4.png
    game.load.image('background', 'assets/background.png');

    // Kenney/Platformer Pack/Tiles/grassHalfMid.png
    game.load.image('grass', 'assets/grass.png');

}

var background;
var xSpacing = 275; // Horizontal space between breadsticks
var score = 0;
var highScore = getSavedData('highScore') ? getSavedData('highScore') : 0;
var gameOverText;
function create () {
    respond(game);

    game.camera.bounds = false;

    background = game.add.sprite(0, 0, 'background');
    background.fixedToCamera = true;

    fillCanvas(background);

    createBreadsticks();

    grassHit = game.add.sprite(0, game.world.height - 32);
    grassHit.width = game.world.width;
    grassHit.height = 64;
    grassHit.body.immovable = true;
    grassHit.fixedToCamera = true;

    grassSprite = game.add.tileSprite(0, game.world.height - 32, game.world.width, 64, 'grass');
    grassSprite.body.immovable = true;
    grassSprite.fixedToCamera = true;

    grass = game.add.group();
    grass.add(grassHit);
    grass.add(grassSprite);

    grassHit.body.collideCallback = function(e){
        console.log('grassHit.body.collideCallback() e: ', e);
    };

    createBagel();

    game.input.onDown.add(function(){
        if (typeof gameOverText !== "undefined" && gameOverText !== null) {
            game.camera.x = 0;
            score = 0;
            scoreText.content = score;
            breadsticks.destroy();
            createBreadsticks();
            bagel.destroy();
            createBagel();
            scoreText.destroy();
            createScoreText();
            gameOverText.destroy();
            gameOverText = null;
        }

        if (!bagel.dead && bagel.y > game.camera.y) {
            bagel.body.velocity.y = -400;
        }
    }, this);

    game.input.keyboard.addCallbacks(this, function(){
        if (!bagel.dead && bagel.y > game.camera.y) {
            bagel.body.velocity.y = -400;
        }
    });

    createScoreText();

}

function update() {

    game.physics.collide(bagel, grass, function(bagel, grass){
        bagel.die();
    });

    game.physics.overlap(bagel, breadsticks, function(){
        bagel.die();
    }, null, this);

    game.physics.overlap(bagel, grass, function(){
        bagel.die();
    }, null, this);

    if (!bagel.dead) {
        game.camera.x += 5;
        bagel.x += 5;
        grassSprite.tilePosition.x += -5;
    }

    if (bagel.y > game.world.height) {
        bagel.die();
    }

    breadsticks.forEach(function(breadstick){
        if (breadstick.x + breadstick.width < game.camera.x) {
            // breadstick.x = game.camera.x + game.world.width + (i+1) * xSpacing;
            breadstick.x = game.camera.x + (breadsticks.length/2) * xSpacing;
        }

        if (bagel.topLeft.x + 32 > breadstick.topRight.x && !breadstick.passed  ) {
            breadstick.passed = true;
            score += 0.5
            scoreText.content = score;
        }
    }, this);

}

function createBagel() {
    var bagelStart = {};
    bagelStart.x = 64;
    bagelStart.y = game.world.height / 2 - 64;

    bagel = game.add.sprite(bagelStart.x, bagelStart.y, 'bagel');
    bagel.scale.x = 1.75;
    bagel.scale.y = 1.75;
    bagel.anchor.setTo(0.5, 0.5);
    bagel.animations.add('spin', [2, 3], 6, true);
    bagel.animations.play('spin');
    bagel.body.gravity.y = 1200;
    bagel.dead = false;

    bagel.die = function() {
        if (bagel.dead) {
            return false;
        }
        bagel.dead = true;
        bagel.animations.stop('spin');
        bagel.body.velocity.y = 0;
        bagel.body.gravity.y = 200;
        bagel.frame = 0;

        if (score > highScore) {
            highScore = score;
            setSavedData('highScore', score);
            console.log('New high score!: ' + highScore);
        }

        createGameOverText();
    };
}

function createBreadsticks() {
    breadsticks = game.add.group();
    for (var i = 0; i < 10; i++) {

        // Vertical space between breadsticks
        var ySpacing = 100;

        var xPos = game.world.width + (i+1) * xSpacing;
        var yPos = (game.world.height / 2) - 650;

        yPos = yPos + (Math.random() * (100 - -200) + -200);

        var topBreadstick = breadsticks.create(xPos, yPos, 'breadstick');
        var bottomBreadstick = breadsticks.create(xPos, topBreadstick.y + ySpacing + topBreadstick.height, 'breadstick');

        topBreadstick.body.immovable = true;
        bottomBreadstick.body.immovable = true;

        var breadstickPolygon = [
            37, 20,
            58, 10,
            76, 17,
            85, 35,
            80, 563,
            68, 584,
            48, 583,
            36, 572,
            22, 528,
            17, 482,
            16, 90
        ];

        topBreadstick.body.setPolygon(breadstickPolygon);
        bottomBreadstick.body.setPolygon(breadstickPolygon);
    }
}

function createScoreText() {
    scoreText = game.add.text(game.camera.width/2, game.camera.x + 100, '0');
    scoreText.anchor.setTo(0.5, 0);
    scoreText.fixedToCamera = true;
}

function createGameOverText() {
    var message = 'You got killed!\nClick wherever to restart';
    if (highScore) {
        message += '\nHigh score: ' + highScore;
    }
    gameOverText = game.add.text(game.camera.width/2, game.camera.height/2, message, {align: 'center'});
    gameOverText.anchor.setTo(0.5, 0.5);
    gameOverText.fixedToCamera = true;
}

function fillCanvas(object) {
    if (!object) {
        return false;
    }

    var changeX = game.width / object.width;
    var changeY = game.height / object.height;

    var scale = Math.max(changeX, changeY);

    object.scale.x = scale;
    object.scale.y = scale;
}

function setSavedData(key, value) {
    return localStorage['flappy_bagel_'+key] = JSON.stringify(value);
}

function getSavedData(key) {
    rawValue = localStorage['flappy_bagel_'+key];

    if (typeof rawValue !== 'string') {
        return rawValue;
    }

    return JSON.parse(rawValue);
}
