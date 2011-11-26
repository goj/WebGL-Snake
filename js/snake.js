var INITIAL_SPINE_LEN = 200;
var RIB_DIST = 10;
var SNAKE_WIDTH = 0.25;
var dt = 0.01;

function Snake(world) {
    this.vertPosBuf = gl.createBuffer();
    this.contour = [];
    this.spine = new Array(INITIAL_SPINE_LEN);
    this.v = 2.5; // velocity
    this.agility = 3;
    var x=0, y=0, px=x, py=y;
    for (var i=0; i < INITIAL_SPINE_LEN; i++) {
        px = x; py = y;
        this.dir = Math.sin(0.01 * i);
        x += Math.cos(this.dir) * this.v * dt;
        y += Math.sin(this.dir) * this.v * dt;
        this.spine[i] = [x, y];
    };
    this.headX = x;
    this.headY = y;
    this.dir = Math.atan2(y-py, x-px);
}

Snake.prototype = {
    turnLeft:  function() { this.dir += this.agility * dt; },
    turnRight: function() { this.dir -= this.agility * dt; },
    move: function() {
        this.headX += Math.cos(this.dir) * this.v * dt;
        this.headY += Math.sin(this.dir) * this.v * dt;
        this.spine.shift();
        this.spine.push([this.headX, this.headY]);
    },
    appendRib: function(j, prevX, prevY, currX, currY) {
        var dirX = currX - prevX;
        var dirY = currY - prevY;
        var dirLen = Math.sqrt(dirX*dirX + dirY*dirY);
        dirX /= dirLen;
        dirY /= dirLen;
        this.contour[j++] = currX - dirY * SNAKE_WIDTH;
        this.contour[j++] = currY + dirX * SNAKE_WIDTH;
        this.contour[j++] = currX + dirY * SNAKE_WIDTH;
        this.contour[j++] = currY - dirX * SNAKE_WIDTH;
        return j;
    },
    draw: function() {
        var ribsNo = Math.floor(this.spine.length / RIB_DIST);
        var tailContourLength = 4*ribsNo;
        var currX, currY, prevX, prevY;

        var j = this.appendRib(0, 2*this.spine[0][0] - this.spine[1][0],
                                  2*this.spine[0][1] - this.spine[1][1],
                                  prevX = this.spine[0][0],
                                  prevY = this.spine[0][1]);

        for (var i=RIB_DIST; i < this.spine.length; i += RIB_DIST) {
            j = this.appendRib(j, prevX, prevY,
                                  currX = this.spine[i][0],
                                  currY = this.spine[i][1]);

            prevX = currX; prevY = currY;
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
