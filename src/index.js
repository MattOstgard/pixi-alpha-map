/**
 * @namespace PIXI.alphaMap
 */

var alphaMap = {
	AlphaMapSprite: require('./AlphaMapSprite.js'),
	AlphaMapShader: require('./AlphaMapShader.js')
}

alphaMap.shader = new alphaMap.AlphaMapShader();

module.exports = global.PIXI.alphaMap = alphaMap;