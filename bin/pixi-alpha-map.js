(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/**
 * @namespace PIXI.alphaMap
 */

var alphaMap = {
    AlphaMapShader: require('./AlphaMapShader.js'),
    AlphaMapVideoShader: require('./AlphaMapVideoShader.js'),
    AlphaMapSprite: require('./AlphaMapSprite.js'),
    AlphaMapMovieClip: require('./AlphaMapMovieClip.js')
}

alphaMap.shader = null;
alphaMap.videoShader = new alphaMap.AlphaMapVideoShader();

module.exports = global.PIXI.alphaMap = alphaMap;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./AlphaMapMovieClip.js":2,"./AlphaMapShader.js":3,"./AlphaMapSprite.js":4,"./AlphaMapVideoShader.js":5}],2:[function(require,module,exports){
/**
 * An AlphaMapMovieClip allows the use of two separate images for color and transparency.
 * In most cases this is useful when you want to are using an image format like jpg that does not support transparency.
 *
 * ```js
 * //TODO
 * ```
 *
 * @class
 * @extends PIXI.extras.MovieClip
 * @memberof PIXI.alphaMap
 * @param textures {PIXI.Texture[]} the RGB (color) textures from the same atlas.
 * @param alphaTexture {PIXI.Texture} the Alpha (transparency) texture.
 */
function AlphaMapMovieClip(textures, alphaTexture)
{
    PIXI.extras.MovieClip.call(this, textures);

    // Create reusable instance of shader and determine which shader to use
    if (!PIXI.alphaMap.shader) {
        PIXI.alphaMap.shader = new PIXI.alphaMap.AlphaMapShader();  
    }

    /**
     * The shader that will be used to render the sprite. By default this is set to AlphaMapShader.
     *
     * @member {PIXI.AbstractFilter|PIXI.Shader}
     */
    this.shader = PIXI.alphaMap.shader;

    /**
     * The texture that the sprite is using
     *
     * @member {PIXI.Texture}
     * @memberof PIXI.AlphaMapMovieClip#
     */
    this.alphaTexture = alphaTexture;
}

// Constructor
AlphaMapMovieClip.prototype = Object.create(PIXI.extras.MovieClip.prototype);
AlphaMapMovieClip.prototype.constructor = AlphaMapMovieClip;
module.exports = AlphaMapMovieClip;

/**
*
* Renders the object using the WebGL renderer
*
* @param renderer {PIXI.WebGLRenderer}
* @private
*/
AlphaMapMovieClip.prototype._renderWebGL = function (renderer)
{
    renderer.setObjectRenderer(renderer.plugins.sprite);
    this.shader.alphaTexture = this.alphaTexture;
    renderer.plugins.sprite.render(this);
};
},{}],3:[function(require,module,exports){
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
            alphaTexture: { type: 'sampler2D', value: 0 }
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
},{}],4:[function(require,module,exports){
/**
 * An AlphaMapSprite allows the use of two separate images for color and transparency.
 * In most cases this is useful when you want to are using an image format like jpg that does not support transparency.
 *
 * ```js
 * //TODO
 * ```
 *
 * @class
 * @extends PIXI.Sprite
 * @memberof PIXI.alphaMap
 * @param texture {PIXI.Texture} the RGB (color) texture.
 * @param alphaTexture {PIXI.Texture} the Alpha (transparency) texture.
 */
function AlphaMapSprite(texture, alphaTexture)
{
    PIXI.Sprite.call(this, texture);

    // Create reusable instance of the shader
    if (!PIXI.alphaMap.shader) {
        PIXI.alphaMap.shader = new PIXI.alphaMap.AlphaMapShader();  
    }

    /**
     * The shader that will be used to render the sprite. By default this is set to AlphaMapShader.
     *
     * @member {PIXI.AbstractFilter|PIXI.Shader}
     */
    this.shader = PIXI.alphaMap.shader;

    /**
     * The texture that the sprite is using
     *
     * @member {PIXI.Texture}
     * @memberof PIXI.AlphaMapSprite#
     */
    this.alphaTexture = alphaTexture;
}

// Constructor
AlphaMapSprite.prototype = Object.create(PIXI.Sprite.prototype);
AlphaMapSprite.prototype.constructor = AlphaMapSprite;
module.exports = AlphaMapSprite;

/**
*
* Renders the object using the WebGL renderer
*
* @param renderer {PIXI.WebGLRenderer}
* @private
*/
AlphaMapSprite.prototype._renderWebGL = function (renderer)
{
    renderer.setObjectRenderer(renderer.plugins.sprite);
    this.shader.alphaTexture = this.alphaTexture;
    renderer.plugins.sprite.render(this);
};
},{}],5:[function(require,module,exports){
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
},{}]},{},[1])


//# sourceMappingURL=pixi-alpha-map.js.map
