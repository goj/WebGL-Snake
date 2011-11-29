var INITIAL_SPINE_LEN = 200;
var RIB_DIST = 10;
var SNAKE_WIDTH = 0.25;
var dt = 0.01;

var HEAD_SHAPE = [1, 1.1, 1.3, 1.25, 1.14, 1.12, 1.1, 0.8, 0.67, 0.4];

function Snake(world) {
    this.vertPosBuf = gl.createBuffer();
    this.texCoordBuf = gl.createBuffer();
    this.vertIdxBuf = gl.createBuffer();
    this.indices = new Uint16Array(4);
    this.contour = new Float32Array(2);
    this.texpos = new Float32Array(4);
    this.spine = new Array(INITIAL_SPINE_LEN);
    var x=-3.0, y=0, px=x, py=y;
    for (var i=0; i < INITIAL_SPINE_LEN; i++) {
        px = x; py = y;
        this.dir = Math.sin(0.03 * i);
        x += Math.cos(this.dir) * this.v * dt;
        y += Math.sin(this.dir) * this.v * dt;
        this.spine[i] = [x, y];
    };
    this.headX = x;
    this.headY = y;
    this.dir = Math.atan2(y-py, x-px);
}

Snake.prototype = {
    v: 2.5, // velocity
    agility: 3,
    turnLeft:  function() { this.dir += this.agility * dt; },
    turnRight: function() { this.dir -= this.agility * dt; },
    move: function() {
        this.headX += Math.cos(this.dir) * this.v * dt;
        this.headY += Math.sin(this.dir) * this.v * dt;
        this.spine.shift();
        this.spine.push([this.headX, this.headY]);
    },
    appendRib: function(i, prevX, prevY, currX, currY, width) {
         width *= SNAKE_WIDTH;
         var j = i, n = i / 2;
         var dirX = currX - prevX;
         var dirY = currY - prevY;
         var dirLen = Math.sqrt(dirX*dirX + dirY*dirY);
         dirX /= dirLen; dirY /= dirLen;
         var v = 0.5 * i * dirLen;
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
    prepareBuffers: function() {
        var ribsNo = Math.floor(this.spine.length / RIB_DIST);
        this.indices = realloc(this.indices, Uint16Array, 2*ribsNo);
        this.contour = realloc(this.contour, Float32Array, 4*ribsNo);
        this.texpos = realloc(this.texpos, Float32Array, 4*ribsNo);

        var currX, currY, prevX, prevY;

        var i = this.appendRib(0, 2*this.spine[0][0] - this.spine[1][0],
                             2*this.spine[0][1] - this.spine[1][1],
                             currX = this.spine[0][0],
                             currY = this.spine[0][1],
                             0);

        for (var r=RIB_DIST; r < this.spine.length; r += RIB_DIST) {
            prevX = currX; prevY = currY;
            i = this.appendRib(i, prevX, prevY,
                             currX = this.spine[r][0],
                             currY = this.spine[r][1],
                             i < 15 ? Math.sin(0.1 * i) : 1);
        };
        var dx = Math.cos(this.dir) * this.v / HEAD_SHAPE.length / 3;
        var dy = Math.sin(this.dir) * this.v / HEAD_SHAPE.length / 3;
        for (var h=0; h < HEAD_SHAPE.length; h++) {
            prevX = currX; prevY = currY;
            currX += dx; currY += dy;
            i = this.appendRib(i, prevX, prevY, currX, currY, HEAD_SHAPE[h]);
        };
        this.contourLength = i / 2;
    },
    drawBuffers: function() {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertIdxBuf);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertPosBuf);
        gl.bufferData(gl.ARRAY_BUFFER, this.contour, gl.STATIC_DRAW);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuf);
        gl.bufferData(gl.ARRAY_BUFFER, this.texpos, gl.STATIC_DRAW);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, SNAKE_TEXTURE);
        gl.uniform1i(shaderProgram.samplerUniform, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertIdxBuf);
        gl.drawElements(gl.TRIANGLE_STRIP, this.contourLength, gl.UNSIGNED_SHORT, 0);
    },
    draw: function() {
        this.prepareBuffers();
        this.drawBuffers();
    }
}
