var PlatfomerGame = PlatformerGame || {};

//title screen
PlatformerGame.Game = function(){};

PlatformerGame.Game.prototype = {
  create: function() {


    //  We're going to be using physics, so enable the Arcade Physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.map = this.game.add.tilemap('level');
    this.map.addTilesetImage('tiles_spritesheet', 'gameTiles');
    this.blockedLayer = this.map.createLayer('blockedLayer', 1260, 14000);
    this.blockedLayer.fixedToCamera = false;
    this.blockedLayer.resizeWorld();
    this.game.world.setBounds(0, 0, 1260, 14000);
    //this.blockedLayer.debug = true;

    itemsUpdate = new Array();
    this.createItems();
    
    this.map.setCollisionBetween(1, 5000, true, 'blockedLayer');
    

    // The this.player and its settings
    var result = this.findObjectsByType('playerStart', this.map, 'objectsLayer');
    this.player = this.game.add.sprite(result[0].x, result[0].y,  'dude'); 
    

    this.player.enableBody = true;
    this.game.physics.arcade.enable(this.player);
    //  this.player physics properties. Give the little guy a slight bounce.
    this.player.body.bounce.y = 0.2;
    this.player.body.gravity.y = 600;
    this.player.body.collideWorldBounds = false;
    this.player.anchor.set(0.5, 0);

    //  Our two animations, walking left and right.
    this.player.animations.add('left', [0, 1, 2, 3], 10, true);
    this.player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  Our controls.
    this.cursors = this.game.input.keyboard.createCursorKeys();
    
    this.game.camera.follow(this.player);
    
    this.infoText = this.game.add.text(600, 250, 'You died!', { fontSize: '32px', fill: '#fff'});
    this.infoText.fixedToCamera = true;
    this.infoText.visible = false;

    this.winText = this.game.add.text(570, 250, 'You have escaped!', { fontSize: '32px', fill: '#fff'});
    this.winText.fixedToCamera = true;
    this.winText.visible = false;

    this.win = false;
    this.death = false;
    this.counter = 0;
    this.timer = 1;
  },

  update: function() {
    this.timer++;

    if (this.death) {
        
        this.counter--;
        if (this.counter < 50) {
            this.infoText.visible = true;
        }
        if (this.counter < 1) {
            this.state.restart();
        }
    }
    if (this.win) {
        this.counter--;
        if (this.counter < 1) {
            this.winText.visible = true;
            this.game.paused = true;
        }
    }
/*
    if (this.timer % 10 == 0) {
        itemsUpdate.forEach(function(item) {
console.log(item);
            var newFrame = item.frame_alt;
            item.frame_alt = item.frame;
            item.frame = newFrame;
            
        }, this);
    }
*/
    this.game.physics.arcade.overlap(this.player, this.items, this.itemCollision, null, this);
    //  Collide the this.player and the stars with the platforms
    this.game.physics.arcade.collide(this.player, this.blockedLayer);
    //this.game.physics.arcade.collide(this.items, this.blockedLayer);


    //  Reset the this.players velocity (movement)
    this.player.body.velocity.x = 0;
    if (this.player.body.velocity.y > 500) {
        this.player.body.velocity.y = 500;
    }

    if (this.cursors.left.isDown)
    {
        //  Move to the left
        this.player.body.velocity.x = -300;
        this.player.animations.play('left');
    }
    else if (this.cursors.right.isDown)
    {
        //  Move to the right
        this.player.body.velocity.x = 300;
        this.player.animations.play('right');
    }
    else
    {
        //  Stand still
        this.player.animations.stop();
        this.player.frame = 4;
    }

    if (this.cursors.up.isDown && this.player.body.blocked.down)
    {
        //  Move to the right
        this.player.body.velocity.y = -100;
    }

},
      
createItems: function() {
    this.items = this.game.add.group();
  
    this.items.enableBody = true;      
    result = this.findObjectsByType('item', this.map, 'objectsLayer');
    result.forEach(function(element) {
        this.createFromTiledObject(element, this.items);
    }, this);
},

// find objects in a tiled layer that contains a property called "type" equal to a value
findObjectsByType: function(type, map, layer) {
    var result = new Array();
    map.objects[layer].forEach(function(element) {
        if (element.properties.type === type) {
            // phaser uses top left - tiled bottom left so need to adjust:
            element.y -= map.tileHeight;
            result.push(element);
        }
    });
    return result;
},

createFromTiledObject: function(element, group) {
    var sprite = group.create(element.x, element.y, 'objects');

    // copy all of the sprite's properties
    Object.keys(element.properties).forEach(function(key) {
        sprite[key] = element.properties[key];
    });

    sprite.frame = parseInt(element.properties.frame);
    sprite.frame_alt = parseInt(element.properties.frame_alt);

    if (element.properties.special === "flicker") {
        itemsUpdate.push(sprite);
    }

},

itemCollision: function(player, item) {
    
    switch (item.special) {
        case 'death': 
            this.death = true;
            if (this.counter == 0) {
                this.counter = 100;
            }
            break;
        case 'exit':
            this.win = true;
            if (this.counter == 0) {
                this.counter = 10;
            }
            break;
        }
    
    },
};