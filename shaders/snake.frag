#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

void main(void) {
    vec4 colour = vec4(0.4, 0.6, 0.1, 1.0);
    float dist = 2.0 * vTextureCoord.t - 1.0;
    vec4 tex = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    gl_FragColor = tex * colour * (1.0 - dist * dist);
    gl_FragColor.a = 1.0;
}
