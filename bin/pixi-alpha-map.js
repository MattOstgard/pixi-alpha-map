(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/**
 * @namespace PIXI.alphaMap
 */

var alphaMap = {
	AlphaMapSprite: require('./AlphaMapSprite.js'),
	AlphaMapShader: require('./AlphaMapShader.js')
}

alphaMap.shader = new alphaMap.AlphaMapShader();

module.exports = global.PIXI.alphaMap = alphaMap;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./AlphaMapShader.js":2,"./AlphaMapSprite.js":3}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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
 * @param texture {PIXI.Texture} the Alpha (transparency) texture.
 */
function AlphaMapSprite(texture, alphaTexture)
{
	PIXI.Sprite.call(this, texture);
	this.shader = PIXI.alphaMap.shader;
	this.alphaTexture = alphaTexture;
}

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

// Constructor
AlphaMapSprite.prototype = Object.create(PIXI.Sprite.prototype);
AlphaMapSprite.prototype.constructor = AlphaMapSprite;
module.exports = AlphaMapSprite;
},{}]},{},[1])


//# sourceMappingURL=pixi-alpha-map.js.map
