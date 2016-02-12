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