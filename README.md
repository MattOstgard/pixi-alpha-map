# WORK IN PROGRESS
## To do:
- Fix: In the example the video texture will sometimes try to play before touch is registered.
- Test with browserify.. and learn how to use it :P
- Clean-up
- (Maybe) AlphaMapVideo: Make something that extends sprite and handles both opaque and transparent videos on mobile but can also fall back to an image sequence.
    - Would have to test for correct color output to work around nvidia defaulting to a crushed color range on PC.
    - See if there is a work around for android lowering background audio when a video element is playing despite there being no audio included and it being muted. Thinking WebM probably works properly here.
    - Would have to also handle audio with the image sequence.
    - Might also want to test video playback performance and fall back to image sequence if it is too bad.
    - Figure out how to determine if iOS device is going to force full screen and fall back to image sequence if it is.
    - Image sequences should have simple streaming support (onReadyToPlay) that tries to determine if enough future frames are loaded to playback without interruption.
    - Have an option to discard old image sequence textures after playing to reduce memory usage.

# pixi-alpha-map

A sprite that uses two separate images for color and transparency for pixi v3

## Usage

### Browserify

If you use browserify you can use pixi-alpha-map like this:

```js
var PIXI = require('pixi.js'),
    alphaMap = require('pixi-alpha-map');

PIXI.loader
    .add('imageRGB', 'assets/image_rgb.jpg');
    .add('imageAlpha', 'assets/image_alpha.jpg');
    .load(function (loader, resources) {
        var alphaMapSprite = new alphaMap.AlphaMapSprite(resources.imageRGB.texture, resources.imageAlpha.texture);

        // add the sprite to the stage and render...
    });
```

### Prebuilt Files

If you are just including the built files, pixi-alpha-map adds itself to a pixi namespace:

```js
PIXI.loader
    .add('imageRGB', 'assets/image_rgb.jpg');
    .add('imageAlpha', 'assets/image_alpha.jpg');
    .load(function (loader, resources) {
        var alphaMapSprite = new PIXI.alphaMap.AlphaMapSprite(resources.imageRGB.texture, resources.imageAlpha.texture);

        // add the sprite to the stage and render...
    });
```

## Building

You will need to have [node][node] and [gulp][gulp] setup on your machine.

Then you can install dependencies and build:

```js
npm i && npm run build
```

That will output the built distributables to `./dist`.

[node]:       http://nodejs.org/
[gulp]:       http://gulpjs.com/
