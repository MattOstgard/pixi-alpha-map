/**
 * @namespace PIXI.alphaMap
 */

var alphaMap = {
    AlphaMapShader: require('./AlphaMapShader.js'),
    AlphaMapVideoShader: require('./AlphaMapVideoShader.js'),
    AlphaMapSprite: require('./AlphaMapSprite.js'),
    AlphaMapMovieClip: require('./AlphaMapMovieClip.js')
}

// Due to a bug in Pixi v3 we have to do mulitple shader instances.
// Instead of using just one shader, we have to use multiple whenever there is an alpha map texture that is different. 
alphaMap.shaderTexPairs = [];

// 
alphaMap.videoShader = new alphaMap.AlphaMapVideoShader();

module.exports = global.PIXI.alphaMap = alphaMap;