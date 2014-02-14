var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-wrap', { preload: preload, create: create, update: update });

function preload () {

    // http://chronicles0.deviantart.com/art/Bagel-Sprite-105754977
    game.load.spritesheet('bagel', 'assets/bagel_spritesheet.png', 32, 32);

    // http://s1229.photobucket.com/user/hercampusemory/media/Baguette_Parisienne_530_g___66_cm.png.html
    game.load.image('breadstick', 'assets/baguette_600.png');

    // Jimp/Turn Based Game/Backgrounds/bg4.png
    game.load.image('background', 'assets/background.png');

    // Kenney/Platformer Pack/Tiles/grassHalfMid.png
    game.load.image('grass', 'assets/grass.gif');

}

var background;
function create () {
    respond(game);

    game.camera.bounds = false;

    background = game.add.sprite(0, 0, 'background');
    background.fixedToCamera = true;

    fillCanvas(background);

    breadsticks = game.add.group();
    for (var i = 0; i < 100; i++) {
        //  Create a breadstick inside of the 'breadsticks' group
        i += 1;

        if (Math.random()<.5) {
            var yPos = -300;
        } else {
            var yPos = game.world.height - 150;
        }

        var breadstick = breadsticks.create(i * 150, yPos, 'breadstick');
        breadstick.body.immovable = true;

        breadstick.body.setPolygon([
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
        ]);
    }

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

    bagel = game.add.sprite(32, game.world.height - 150, 'bagel');
    bagel.scale.x = 1.75;
    bagel.scale.y = 1.75;
    bagel.animations.add('spin', [2, 3], 6, true);
    bagel.animations.play('spin');
    bagel.body.gravity.y = 1200;

    bagel.die = function() {
        // alert('Ya got killed! Nice!');

        if (bagel.dead) {
            return false;
        }
        bagel.dead = true;
        bagel.animations.stop('spin');
        bagel.body.velocity.y = 0;
        bagel.body.gravity.y = 200;
        bagel.frame = 0;
    };

    game.input.onDown.add(function(){
        if (!bagel.dead) {
            bagel.body.velocity.y = -400;
        }
    }, this);

    game.input.keyboard.addCallbacks(this, function(){
        if (!bagel.dead) {
            bagel.body.velocity.y = -400;
        }
    });

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
    }

    if (bagel.y > game.world.height) {
        bagel.die();
    }

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
