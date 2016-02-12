'use strict';
window.onerror = function (errorMsg, url, lineNumber) {
    alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber);
}

///////////////////////////////////////////////////////////////////
// Game
///////////////////////////////////////////////////////////////////

function Game() {
    // Initialize stage
    this.stageWidth = 1920;
    this.stageHeight = 1080;
    this.center = new PIXI.Point( this.stageWidth / 2, this.stageHeight / 2);
    this.stage = new PIXI.Container();
    this.renderer = PIXI.autoDetectRenderer(this.stageWidth, this.stageHeight, {
        antialias: false
    });
    
    var defaultFont = {
        font: 'bold italic 15px Arial',
        fill: '#FFF',
        stroke: '#000',
        strokeThickness: 5
    };

    // Setup the renderer
    this.renderer.plugins.interaction.autoPreventDefault = false;
    document.body.appendChild(this.renderer.view);
    
    // Track frames per second
    this.fpsMeter = new FPSMeter();

    // Load Background
    this.backgroundTex = PIXI.Texture.fromImage('assets/Lion_King_Backdrop_25.jpg');
    this.background = new PIXI.Sprite(this.backgroundTex);
    this.background.width = this.stageWidth;
    this.background.height = this.stageHeight;
    this.background.hitArea = new PIXI.Rectangle(0, 0, 1920, 1200);
    this.background.interactive = true;
    
    // Watch first tap so we can initialize videos and sounds
    this.gotFirstTap = false;
    this.timeOfFirstTap = null;
    this.renderer.view.addEventListener('click', (function(){
        this.timeOfFirstTap = this.getTime();
        this.gotFirstTap = true;
    }).bind(this), false);
    
    PIXI.loader
        .add('fancyRGB', 'assets/fancy_text.json')
        .add('fancyAlpha', 'assets/fancy_text_alpha.jpg')
        .once('complete', this.loadComplete.bind(this))
        .load();

    this.stage.addChild(this.background);
}

Game.prototype.getTime = function() {
    return 0.001 * (new Date().getTime());
}

Game.prototype.loadComplete = function(loader, resources) {
    
    // Get textures
    this.rgbTextures = []
    for (var frameName in PIXI.loader.resources.fancyRGB.textures) {
        this.rgbTextures.push(PIXI.loader.resources.fancyRGB.textures[frameName]);
    }
    this.rgbTex = this.rgbTextures[20];
    this.alphaTex = PIXI.loader.resources.fancyAlpha.texture;
    
    // Sprite
    this.fancySprite = new PIXI.alphaMap.AlphaMapSprite(this.rgbTex, this.alphaTex);
    this.stage.addChild(this.fancySprite);
    
    // Movieclip
    this.fancyMC = new PIXI.alphaMap.AlphaMapMovieClip(this.rgbTextures, this.alphaTex);
    this.fancyMC.anchor.set(0.5);
    this.fancyMC.position = this.center;
    this.fancyMC.scale.set(2);
    this.fancyMC.animationSpeed = 15 / 60; // 15 fps
    this.fancyMC.loop = true;
    this.fancyMC.play();
    this.stage.addChild(this.fancyMC);
    
    // Start the game loop
    this.update();
}

Game.prototype.update = function() {
    // Render
    this.renderer.render(this.stage);
    this.fpsMeter.tick();
    window.requestAnimationFrame(this.update.bind(this));
}

///////////////////////////////////////////////////////////////////
// Start the game
///////////////////////////////////////////////////////////////////
var game = new Game();