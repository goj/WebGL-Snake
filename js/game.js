var KEY_LEFT = false;
var KEY_RIGHT = false;
var PAUSE = false;

var UPS = 60 / 1000; // do 40 updates per second
var snake;
var lastFrame = Date.now();

function startGame() {
    loadResources(startWorld);
}

function startWorld() {
    webGLStart();
    addKeyListeners();
    snake = new Snake();
    tick();
}

function updateGame() {
    if (!PAUSE) {
        if (KEY_LEFT && !KEY_RIGHT)
            snake.turnLeft();
        if (KEY_RIGHT && !KEY_LEFT)
            snake.turnRight();
        snake.move();
    }
    lastFrame = Date.now();
}

function tick() {
    var t = Date.now() - lastFrame;
    var steps = Math.floor(UPS * t);
    while (steps-- > 0) {
        updateGame();
    }

    clearScene();
    setMatrixUniforms();

    snake.draw();
    requestAnimFrame(tick);
}

function addKeyListeners() {
    document.addEventListener('keydown', function(e) {
        switch (e.keyCode) {
            case 37: KEY_LEFT  = true; break;
            case 39: KEY_RIGHT = true; break;
            case 80: PAUSE = !PAUSE; break;
        }
    });

    document.addEventListener('keyup', function(e) {
        switch (e.keyCode) {
            case 37: KEY_LEFT  = false; break;
            case 39: KEY_RIGHT = false; break;
        }
    });
}
