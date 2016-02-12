/**
 * @namespace PIXI.alphaMap
 */

var alphaMap = {
	AlphaMapSprite: require('./AlphaMapSprite.js'),
	AlphaMapShader: require('./AlphaMapShader.js'),
	AlphaMapMovieClip: require('./AlphaMapMovieClip.js')
}

alphaMap.shader = new alphaMap.AlphaMapShader();

module.exports = global.PIXI.alphaMap = alphaMap;