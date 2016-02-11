function AlphaMapShader()
{
    PIXI.AbstractFilter.call(this,
        // Vertex shader
        null,

        // Fragment shader
        [
            'precision lowp float;',

            'varying vec2 vTextureCoord;',
            'varying vec4 vColor;',

            'uniform sampler2D uSampler;',
            'uniform sampler2D alphaTexture;',

            'void main(void){',
            '   vec3 color = texture2D(uSampler, vTextureCoord).rgb;',
            '   float alpha = texture2D(alphaTexture, vTextureCoord).r;',
            '   gl_FragColor = vec4(color.r, color.g, color.b, alpha) * vColor;',
            '}'
        ].join('\n'),

        // Custom uniforms
        {
            alphaTexture: { type: 'sampler2D', value: 1 }
        }
    );
}

AlphaMapShader.prototype = Object.create(PIXI.AbstractFilter.prototype);
AlphaMapShader.prototype.constructor = AlphaMapShader;
module.exports = AlphaMapShader;

Object.defineProperties(AlphaMapShader.prototype, {
    /**
     * Alpha texture to be used as transparency.
     *
     * @member {PIXI.Texture}
     * @memberof PIXI.alphaMap.AlphaMapShader#
     */
    alphaTexture: {
        get: function ()
        {
            return this.uniforms.alphaTexture.value;
        },
        set: function (value)
        {
            this.uniforms.alphaTexture.value = value;
        }
    }
});