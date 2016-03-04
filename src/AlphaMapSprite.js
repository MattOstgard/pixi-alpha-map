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
    var shader = null;
    for (var i in PIXI.alphaMap.shaderTexPairs) {
        if (PIXI.alphaMap.shaderTexPairs[i].alphaTexture === alphaTexture) {
            shader = PIXI.alphaMap.shaderTexPairs[i].shader;
        }
    }

    //
    if (shader === null) {
        shader = new PIXI.alphaMap.AlphaMapShader();
        PIXI.alphaMap.shaderTexPairs.push({shader: shader, alphaTexture: alphaTexture});
    }

    /**
     * The shader that will be used to render the sprite. By default this is set to AlphaMapShader.
     *
     * @member {PIXI.AbstractFilter|PIXI.Shader}
     */
    this.shader = shader;

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