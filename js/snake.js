var INITIAL_SPINE_LEN = 200;
var RIB_DIST = 10;
var SNAKE_WIDTH = 0.25;
var dt = 0.01;

function Snake(world) {
    this.vertPosBuf = gl.createBuffer();
    this.texCoordBuf = gl.createBuffer();
    this.vertIdxBuf = gl.createBuffer();
    this.contour = [];
    this.texpos = [];
    this.indices = [];
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
    appendRib: function(i, prevX, prevY, currX, currY) {
        var v = i / this.spine.length * RIB_DIST * 2;
        var j = i, n = i / 2;
        var dirX = currX - prevX;
        var dirY = currY - prevY;
        var dirLen = Math.sqrt(dirX*dirX + dirY*dirY);
        dirX /= dirLen;
        dirY /= dirLen;
        var width = SNAKE_WIDTH;
        if (i < 15)
            width *= Math.sin(0.1 * i);
        this.indices[n] = n;
        this.indices[n + 1] = n + 1;
        this.contour[i++] = currX - dirY * width;
        this.contour[i++] = currY + dirX * width;
        this.contour[i++] = currX + dirY * width;
        this.contour[i++] = currY - dirX * width;
        this.texpos[j++] = v;
        this.texpos[j++] = 0;
        this.texpos[j++] = v;
        this.texpos[j++] = 1;
        return i;
    },
    draw: function() {
        var ribsNo = Math.floor(this.spine.length / RIB_DIST);
        var tailContourLength = 4*ribsNo;
        var currX, currY, prevX, prevY;

        var i = this.appendRib(0, 2*this.spine[0][0] - this.spine[1][0],
                                  2*this.spine[0][1] - this.spine[1][1],
                                  prevX = this.spine[0][0],
                                  prevY = this.spine[0][1]);

        for (var r=RIB_DIST; r < this.spine.length; r += RIB_DIST) {
            i = this.appendRib(i, prevX, prevY,
                                  currX = this.spine[r][0],
                                  currY = this.spine[r][1]);
            prevX = currX; prevY = currY;
        };

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertIdxBuf);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertPosBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.contour), gl.STATIC_DRAW);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texpos), gl.STATIC_DRAW);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, SNAKE_TEXTURE);
        gl.uniform1i(shaderProgram.samplerUniform, 0);

        mat4.scale(mvMatrix, [0.5, 0.5, 1.0]);
        mat4.translate(mvMatrix, [-3.0, 0.0, 0.0]);
        setMatrixUniforms();

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertIdxBuf);
        gl.drawElements(gl.TRIANGLE_STRIP, tailContourLength / 2, gl.UNSIGNED_SHORT, 0);
    }
}
