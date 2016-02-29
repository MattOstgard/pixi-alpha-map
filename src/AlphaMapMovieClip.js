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
 * @param textures {PIXI.Texture[]} the RGB (color) textures.
 * @param alphaTexture {PIXI.Texture} the Alpha (transparency) textures that correspond to each texture the textures array.
 */
function AlphaMapMovieClip(textures, alphaTextures)
{
    PIXI.extras.MovieClip.call(this, textures);

    // Create reusable instance of shader
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
     * the Alpha (transparency) textures that correspond to each texture the textures array.
     *
     * @member {PIXI.Texture}
     * @memberof PIXI.AlphaMapMovieClip#
     */
    this.alphaTextures = alphaTextures;
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
    renderer.plugins.sprite.render(this);
};