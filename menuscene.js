var MenuScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "MenuScene" });
    },
    init: function() {},
    preload: function() {
        this.load.image('menu', 'assets/menu.png');

    },
    create: function() {
        this.add.image(400, 200, 'menu');

        var startButton = this.add.text(300, 250, 'Start Game', { fontSize: '32px', fill: '#000' });
        startButton.setInteractive();
        startButton.on('pointerdown', function () {
            this.scene.start('GameScene');
        }, this);
    
        var settingsButton = this.add.text(300, 300, 'Settings', { fontSize: '32px', fill: '#000' });
        var quitButton = this.add.text(300, 350, 'Quit', { fontSize: '32px', fill: '#000' });
    
        startButton.on('pointerover', function () { startButton.setStyle({ fill: '#ff0' }); });
        startButton.on('pointerout', function () { startButton.setStyle({ fill: '#fff' }); });
    
        settingsButton.on('pointerover', function () { settingsButton.setStyle({ fill: '#ff0' }); });
        settingsButton.on('pointerout', function () { settingsButton.setStyle({ fill: '#fff' }); });
    
        quitButton.on('pointerover', function () { quitButton.setStyle({ fill: '#ff0' }); });
        quitButton.on('pointerout', function () { quitButton.setStyle({ fill: '#fff' }); });
    
        quitButton.setInteractive();
        quitButton.on('pointerdown', function () {
            this.game.destroy(true);
        }, this);
    },
    update: function() {}
});