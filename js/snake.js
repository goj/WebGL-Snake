var INITIAL_SPINE_LEN = 400;
var RIB_DIST = 25;
var SNAKE_WIDTH = 0.25;

function Snake() {
    this.vertPosBuf = gl.createBuffer();
    this.spine = new Array(INITIAL_SPINE_LEN);
    var px = 0, py = 0;
    for (var i=0; i < INITIAL_SPINE_LEN; i++) {
        px = x; py = y;
        var x = 0.02 * i;
        var y = 0.2 * Math.sin(0.024 * i);
        this.spine[i] = [x, y];
    };
    this.headX = x;
    this.headY = y;
    this.contour = [];
}

Snake.prototype = {
    draw: function() {
        var ribsNo = Math.floor(this.spine.length / RIB_DIST);
        var tailContourLength = 4*ribsNo-2;
        var curX, curY, prevX, prevY, dirX, dirY;

        var j=0;
        prevX = this.contour[j++] = this.spine[0][0];
        prevY = this.contour[j++] = this.spine[0][1];
        for (var i=RIB_DIST; i < this.spine.length; i += RIB_DIST) {
            curX = this.spine[i][0];
            curY = this.spine[i][1];
            dirX = curX - prevX;
            dirY = curY - prevY;
            var dirLen = Math.sqrt(dirX*dirX + dirY*dirY);
            dirX /= dirLen;
            dirY /= dirLen;

            this.contour[j++] = curX - dirY * SNAKE_WIDTH;
            this.contour[j++] = curY + dirX * SNAKE_WIDTH;
            this.contour[j++] = curX + dirY * SNAKE_WIDTH;
            this.contour[j++] = curY - dirX * SNAKE_WIDTH;

            prevX = curX;
            prevY = curY;
        };

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertPosBuf);
        gl.bufferData(gl.ARRAY_BUFFER,
                      new Float32Array(this.contour),
                      gl.STATIC_DRAW);

        mat4.scale(mvMatrix, [0.5, 0.5, 1.0]);
        mat4.translate(mvMatrix, [-3.0, 0.0, 0.0]);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertPosBuf);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
                               2, gl.FLOAT, false, 0, 0);
        setMatrixUniforms();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, tailContourLength / 2);
    }
}
