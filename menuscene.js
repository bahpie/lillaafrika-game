var MenuScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "MenuScene" });
        console.log("Kom hit")
    },
    init: function() {
    },
    preload: function() {
        this.load.image('menu', 'assets/menubackground.png');
        this.input.on('pointerdown', function(pointer) {
            this.scene.start('CreditsScene');

        }, this);   


    },
    create: function() {

    },
    update: function() {}
});