var PlatformerGame = PlatformerGame || {};

//loading the game assets
PlatformerGame.Preload = function(){};

PlatformerGame.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);

    this.load.setPreloadSprite(this.preloadBar);

    //load game assets
    this.load.tilemap('level', 'assets/level.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('gameTiles', 'assets/tiles_spritesheet.png');
    this.game.load.spritesheet('objects', 'assets/tiles_spritesheet.png', 72, 72);
    this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
  },
  create: function() {
    this.state.start('Game');
  }
};
