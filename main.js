
var config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    scene: [MenuScene, GameScene]
    
};

const trackLength = 1000;

var game = new Phaser.Game(config);

var platforms;
var player;
var cursors;
var background;
var middleground;
var foreground;

var emitter;
var particles;

var screenWidth = window.screen.width;
var screenHeight = window.screen.height;