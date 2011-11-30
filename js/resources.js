var RESOURCES = {
    snakeVS: {src: 'shaders/snake.vert', getter: loadViaAjax},
    snakeFS: {src: 'shaders/snake.frag', getter: loadViaAjax},
    snakeSkinTex: {src: 'img/snake.png', getter: loadImage},
};

function loadViaAjax(res, callback) {
    var request = new XMLHttpRequest();
    request.open("GET", res.src);
    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            res.data = request.responseText;
            callback();
        }
    }
    request.send();
}

function loadImage(res, callback) {
    res.image = new Image();
    res.image.src = res.src;
    res.image.crossOrigin = "anonymous";
    res.image.onload = callback;
}

function loadResources(callback) {
    var resourcesToGo = 0;
    for (var res in RESOURCES) {
        ++resourcesToGo;
        RESOURCES[res].getter(RESOURCES[res], function() {
            if (--resourcesToGo == 0) {
                callback();
            }
        });
    }
}
