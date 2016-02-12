function AlphaMapVideoShader(shaderManager)
{
    PIXI.AbstractFilter.call(this,
        // Vertex shader
        [
            'precision lowp float;',
            'attribute vec2 aVertexPosition;',
            'attribute vec2 aTextureCoord;',
            'attribute vec4 aColor;',

            'uniform mat3 projectionMatrix;',

            'varying vec2 vTextureCoord;',
            'varying vec2 vTextureCoord2;',
            'varying vec4 vColor;',

            'void main(void){',
            '   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);',
            '   vTextureCoord = vec2(aTextureCoord.x, aTextureCoord.y * 0.5);',
            '   vTextureCoord2 = vec2(aTextureCoord.x, (aTextureCoord.y * 0.5) + 0.5);',
            '   vColor = vec4(aColor.rgb * aColor.a, aColor.a);',
            '}'
        ].join('\n'),

        // Fragment shader
        [
            'precision lowp float;',

            'varying vec2 vTextureCoord;',
            'varying vec2 vTextureCoord2;',
            'varying vec4 vColor;',

            'uniform sampler2D uSampler;',

            'void main(void){',

            '   float alpha = texture2D(uSampler, vTextureCoord).g;',
            '   vec3 color = texture2D(uSampler, vTextureCoord2).rgb;',
                // Remap values so that 0.064 is black because on PC nvidia limits the colors to 16-235 for some stupid
                // reason. To do this right we would have to load a test video, check the black value the video is
                // outputting and pick an appropriate shader.
            '    vec4 nvidiaCrushColors = (vec4(color.rgb, alpha) - 0.063) * 1.06723;',
            '   gl_FragColor = nvidiaCrushColors * vColor;',
            '}'
        ].join('\n'),

        // Custom uniforms
        null
    );
}

// Constructor
AlphaMapVideoShader.prototype = Object.create(PIXI.AbstractFilter.prototype);
AlphaMapVideoShader.prototype.constructor = AlphaMapVideoShader;
module.exports = AlphaMapVideoShader;