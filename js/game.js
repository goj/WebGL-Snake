var UPS = 60 / 1000; // do 40 updates per second
var snake;
var lastFrame = Date.now();

function startGame() {
    webGLStart();
    snake = new Snake();
    tick();
}

function updateGame() {
    snake.move();
    lastFrame = Date.now();
}

function tick() {
    var t = Date.now() - lastFrame;
    var steps = Math.floor(UPS * t);
    while (steps-- > 0) {
        updateGame();
    }
    clearScene();
    snake.draw();
    requestAnimFrame(tick);
}
