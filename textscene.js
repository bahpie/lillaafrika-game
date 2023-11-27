var TextScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "TextScene" });
    },
    init: function() {},
    preload: function() {

    },
    create: function() {
        // Set background color (optional)
        this.cameras.main.setBackgroundColor('#000000');

        // Create a piece of text in the middle of the screen
        const text1 = this.add.text(
            this.cameras.main.width / 4,
            this.cameras.main.height / 2 - 200,
            'Bana 1',
            {
                fontSize: '32px',
                fill: '#fff',
            }
        );
        const text2 = this.add.text(
            this.cameras.main.width / 5 - 50,
            this.cameras.main.height / 2 - 100,
            'Vägen ut ur Göteborg',
            {
                fontSize: '32px',
                fill: '#fff',
            }
        );
        
        
        this.input.on('pointerdown', function(pointer) {
            // Handle pointer down event here
            this.scene.start('GameScene');

        }, this);
    },
    update: function() {}
});