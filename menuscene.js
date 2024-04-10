var MenuScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "MenuScene" });
   
    },
    init: function() {
    },
    preload: function() {
        console.log("Kom hit")
        this.load.image('menu', 'assets/menubackground.png');
        this.input.on('pointerdown', function(pointer) {
            this.scene.start('TextScene');

        }, this); 


    },
    create: function() {
        var background = this.add.image(0,0,'menu')
        background.setOrigin(0,0)
    },
    update: function() {}
});