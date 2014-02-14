function respond(game) {

    //Get the canvas, context & container
    var canvas = game.canvas;
    var ctx = game.context;
    var container = document.getElementById(game.parent);

    //Run function when browser resizes
    window.onresize = respondCanvas;

    function respondCanvas(){

        var width = container.offsetWidth;
        var height = container.offsetHeight;

        canvas.width = width; //max width
        canvas.height = height; //max height

        //Call a function to redraw other content (texts, images etc)
        game.world.width = width;
        game.world.height = height;

        game.width = width;
        game.height = height;


        game.stage.bounds.width = width;
        game.stage.bounds.height = height;

        if (game.renderType === Phaser.WEBGL) {
            game.renderer.resize(width, height);
        }

        fillCanvas(background);

    }

    //Initial call
    respondCanvas(game);

}