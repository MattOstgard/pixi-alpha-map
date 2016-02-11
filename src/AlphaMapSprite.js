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