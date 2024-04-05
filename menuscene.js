var MenuScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "MenuScene" });
    },
    init: function() {},
    preload: function() {
        this.load.image('menu', 'static/assets/menubackground.png');

    },
    create: function() {
        this.add.image(this.cameras.main.width /2, this.cameras.main.height / 2 - 100, 'menu');

        this.input.on('pointerdown', function(pointer) {
            // Handle pointer down event here
            this.scene.start('GameScene');

        }, this);

    },
    update: function() {}
});