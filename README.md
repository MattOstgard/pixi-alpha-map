# WORK IN PROGRESS

# pixi-alpha-map

A sprite that uses two separate images for color and transparency for pixi v3

## Usage

### Browserify

If you use browserify you can use pixi-alpha-map like this:

```js
var PIXI = require('pixi.js'),
    spine = require('pixi-alpha-map');

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