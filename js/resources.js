var RESOURCES = {
    snakeVS: {src: 'shaders/snake.vert', getter: loadViaAjax},
    snakeFS: {src: 'shaders/snake.frag', getter: loadViaAjax},
};

function loadViaAjax(res, progress, callback) {
    var request = new XMLHttpRequest();
    request.open("GET", res.src);
    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            res.data = request.responseText;
            if (--progress.toGo == 0) {
                callback();
            }
        }
    }
    request.send();
}

function loadResources(callback) {
    var progress = {toGo: 0};
    for (var res in RESOURCES) {
        ++progress.toGo;
        RESOURCES[res].getter(RESOURCES[res], progress, callback);
    }
}
