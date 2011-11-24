function Snake() {
    this.vertPosBuf = gl.createBuffer();
}

Snake.prototype = {
    draw: function() {
        var spine = [
            [0.0, 0.0],
            [1.0, 0.12],
            [2.0, 0.25],
            [3.0, 0.3],
            [4.0, 0.25],
            [5.0, 0.12],
            [6.0, 0.0],
        ];
        var contour = new Array(2*(spine.length-1)+1);
        var curX, curY, prevX, prevY, dirX, dirY;
        var j=0;
        var w=1.0; // snake's width

        prevX = contour[j++] = spine[0][0];
        prevY = contour[j++] = spine[0][1];
        for (var i=1; i < spine.length; i+=1) {
            curX = spine[i][0];
            curY = spine[i][1];
            dirX = curX - prevX;
            dirY = curY - prevY;
            var dirLen = Math.sqrt(dirX*dirX + dirY*dirY);
            dirX /= dirLen;
            dirY /= dirLen;

            contour[j++] = curX - dirY * w;
            contour[j++] = curY + dirX * w;
            contour[j++] = curX + dirY * w;
            contour[j++] = curY - dirX * w;

            prevX = curX;
            prevY = curY;
        };

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertPosBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(contour), gl.STATIC_DRAW);
        this.vertPosBuf.itemSize = 2;
        this.vertPosBuf.numItems = contour.length / 2;

        mat4.scale(mvMatrix, [0.5, 0.5, 1.0]);
        mat4.translate(mvMatrix, [-3.0, 0.0, 0.0]);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertPosBuf);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
                               this.vertPosBuf.itemSize,
                               gl.FLOAT, false, 0, 0);
        setMatrixUniforms();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertPosBuf.numItems);
    }
}
