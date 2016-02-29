'use strict';
window.onerror = function (errorMsg, url, lineNumber) {
    alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber);
}

///////////////////////////////////////////////////////////////////
// Game
///////////////////////////////////////////////////////////////////

function Game() {
    // Initialize stage
    this.stageWidth = 960;
    this.stageHeight = 540;
    this.center = new PIXI.Point( this.stageWidth / 2, this.stageHeight / 2);
    this.stage = new PIXI.Container();
    this.renderer = PIXI.autoDetectRenderer(this.stageWidth, this.stageHeight, {
        antialias: false
    });
    
    this.defaultFont = {
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
    this.backgroundTex = PIXI.Texture.fromImage('examples/assets/Lion_King_Backdrop_25.jpg');
    this.background = new PIXI.Sprite(this.backgroundTex);
    this.background.width = this.stageWidth;
    this.background.height = this.stageHeight;
    this.background.hitArea = new PIXI.Rectangle(0, 0, 1920, 1200);
    this.background.interactive = true;
    
    // Had issues loading videos with the standard loader, so just bypassing it.
    this.fancyVidTex = PIXI.Texture.fromVideo('examples/assets/fancy_stacked_alpha.mp4');

    // Watch first tap so we can initialize videos and sounds
    this.gotFirstTap = false;
    this.timeOfFirstTap = null;
    this.renderer.view.addEventListener('click', (function(){
        this.gotFirstTap = true;

        // Play and immediately pause all videos with the first tap within the actual callback function
        // otherwise mobile devices will not allow programmatic playback.
        this.fancyVidTex.baseTexture.source.play();
        this.fancyVidTex.baseTexture.source.pause();

        // Try to force iOS devices to play inline rather than fullscreen.
        // This is currently (2016-02) still ignored on small form iPhones (not sure about iPhone+)
        this.fancyVidTex.baseTexture.source.setAttribute('webkit-playsinline', 'webkit-playsinline');
        
        //
        this.fancyVidTex.baseTexture.source.defaultMuted = true;
        this.fancyVidTex.baseTexture.source.mute = true;
        this.fancyVidTex.baseTexture.source.loop = true;
    }).bind(this), false);
    
    PIXI.loader
        .add('fancyRGB', 'examples/assets/fancy_text.json')
        .add('fancyAlpha', 'examples/assets/fancy_text_alpha.jpg')
        .add('spinnyRGB', 'examples/assets/spinny_jpg.json')
        .add('spinnyAlpha', 'examples/assets/spinny_alpha.jpg')
        .once('complete', this.loadComplete.bind(this))
        .load();

    this.stage.addChild(this.background);
}

Game.prototype.loadComplete = function(loader, resources) {
    
    // Get frame textures
    this.rgbTextures = []
    this.alphaTextures = []
    for (var frameName in PIXI.loader.resources.fancyRGB.textures) {
        this.rgbTextures.push(PIXI.loader.resources.fancyRGB.textures[frameName]);
        this.alphaTextures.push(PIXI.loader.resources.fancyAlpha.texture);
    }

    // Get frame textures
    this.spinnyRGBTextures = []
    this.spinnyAlphaTextures = []
    for (var frameName in PIXI.loader.resources.spinnyRGB.textures) {
        this.spinnyRGBTextures.push(PIXI.loader.resources.spinnyRGB.textures[frameName]);
        this.spinnyAlphaTextures.push(PIXI.loader.resources.spinnyAlpha.texture);
    }

    //
    this.rgbTexture = this.rgbTextures[20];
    this.alphaTexture = PIXI.loader.resources.fancyAlpha.texture;
    
    // Sprite
    this.fancySprite = new PIXI.alphaMap.AlphaMapSprite(this.rgbTexture, this.alphaTexture);
    this.fancySprite.anchor.set(0.5);
    this.fancySprite.x = 250;
    this.fancySprite.y = 100;
    this.stage.addChild(this.fancySprite);

    // Sprite label
    this.fancySpriteText = new PIXI.Text('<- AlphaMapSprite', this.defaultFont);
    this.fancySpriteText.anchor.y = 0.5;
    this.fancySpriteText.x = this.fancySprite.x + (this.fancySprite.width * this.fancySprite.anchor.x) + 20;
    this.fancySpriteText.y = this.fancySprite.y;
    this.stage.addChild(this.fancySpriteText);
    
    // Movieclip
    this.fancyMC = new PIXI.alphaMap.AlphaMapMovieClip(this.spinnyRGBTextures, this.spinnyAlphaTextures);
    this.fancyMC.anchor.set(0.5);
    this.fancyMC.x = this.stageWidth - 250;
    this.fancyMC.y = this.center.y;
    this.fancyMC.animationSpeed = 15 / 60; // 15 fps
    this.fancyMC.loop = true;
    this.fancyMC.play();
    this.stage.addChild(this.fancyMC);

    // Sprite label
    this.fancyMCText = new PIXI.Text('AlphaMapMovieClip ->', this.defaultFont);
    this.fancyMCText.anchor.x = 1;
    this.fancyMCText.anchor.y = 0.5;
    this.fancyMCText.x = this.fancyMC.x - (this.fancyMC.width * this.fancyMC.anchor.x) - 20;
    this.fancyMCText.y = this.fancyMC.y;
    this.stage.addChild(this.fancyMCText);

    // Sprite label
    this.fancyVidText = new PIXI.Text('==== Click anywhere to load video texture ====', this.defaultFont);
    this.fancyVidText.anchor.x = 0.5;
    this.fancyVidText.anchor.y = 0.5;
    this.fancyVidText.x = this.center.x;
    this.fancyVidText.y = this.stageHeight - 100;
    this.stage.addChild(this.fancyVidText);

    // Start the game loop
    this.videoLoadUpdate();
}

Game.prototype.videoLoadUpdate = function() {
    // Render
    this.renderer.render(this.stage);
    this.fpsMeter.tick();

    // 
    if (this.gotFirstTap && this.fancyVidTex.baseTexture.hasLoaded) {
        this.videoLoadComplete(PIXI.loader, PIXI.loader.resources);
        // Go to main update loop
        window.requestAnimationFrame(this.update.bind(this));
    }
    else {
        // Conintue checking if video is loaded
        window.requestAnimationFrame(this.videoLoadUpdate.bind(this));
    }
}

Game.prototype.videoLoadComplete = function(loader, resources) {
    // VideoTexture
    this.fancyVid = new PIXI.Sprite(this.fancyVidTex);
    this.fancyVid.shader = PIXI.alphaMap.videoShader;
    this.fancyVid.scale = new PIXI.Point(1, 0.5);
    this.fancyVid.anchor.set(0.5);
    this.fancyVid.x = this.fancySprite.x;
    this.fancyVid.y = this.stageHeight - 100;
    this.fancyVid.texture.baseTexture.source.play();

    //
    this.fancyVidText.text = '<- Video Texture using AlphaMapVideoShader';
    this.fancyVidText.anchor.x = 0;
    this.fancyVidText.x = this.fancyVid.x + (this.fancyVid.width * this.fancyVid.anchor.x) + 20;
    this.stage.addChild(this.fancyVid);
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