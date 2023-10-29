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
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

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


function preload() {
    this.load.image('menu', 'assets/menu.png');
}

function create() {
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
}

function update() {

}

var gameScene = new Phaser.Scene('GameScene');

gameScene.preload = function() {
    this.load.image('sky', 'assets/mountains-back.png');
    this.load.image('mountains', 'assets/mountains-mid1.png');
    this.load.image('trees', 'assets/mountains-mid2.png');
    this.load.spritesheet('dude', 'assets/animator.png', { frameWidth: 64, frameHeight: 64 });
    this.load.image('ground', 'assets/tile128.png');
    this.load.image('star', 'assets/potato64.png');

    this.load.audio('bgmusic', 'assets/tune.mp3');

    this.load.image('particle', 'assets/potato24.png');

}

gameScene.create = function() {
    music = this.sound.add('bgmusic');
    music.play({ loop: true });

    this.cameras.main.setBackgroundColor('#999')


    background = this.add.tileSprite(0, 768-894+250, 2048*2, 894, 'sky');
    middleground = this.add.tileSprite(0, 768-770+250, 2048*2, 770, 'mountains');
    foreground = this.add.tileSprite(0, 768-482+250, 2048*2, 482, 'trees');

    player = this.physics.add.sprite(100, 0, 'dude');
    player.setBounce(0.1);
    player.setCollideWorldBounds(false);

    platforms = this.physics.add.staticGroup();
    var previousPlatform = 400;
    for(i = 0; i< 4096;i+=220) {
        var y = 0;
        while(y < previousPlatform - 140) {
            y = Math.random() * 400;
        }
        platforms.create(i,y,'ground').setScale(1).refreshBody();

        previousPlatform = y;
    }
    
    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();

    this.cameras.main.setBounds(0, 0, 857*2, screenHeight);
    this.physics.world.setBounds(0, 0, 857 * 8, screenHeight);

    stars = this.physics.add.group({
        key: 'star',
        repeat: 30,
        setXY: { x: 12, y: 0, stepX: 140 }
    });

    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(player, stars, collectStar, null, this);

    score = 0;
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#FFF' });
    scoreText.setScrollFactor(0);


    this.input.on('pointerdown', function(pointer) {
        // Handle pointer down event here
        if(player.body.blocked.down) {
            player.setVelocityY(-530);
        }
        console.log('Pointer down at x: ' + pointer.x + ', y: ' + pointer.y);
    }, this);

    particles = this.add.particles('particle');

    // Customize the particle emitter properties
    emitter = particles.createEmitter({
        speed: 100,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD'
    });

    emitter.stop();

}

gameScene.update = function() {

    if (cursors.left.isDown) {
        player.setVelocityX(-160);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
    } else {
        player.setVelocityX(0);
    }

    player.setVelocityX(160);

    if (cursors.up.isDown && player.body.blocked.down) {
        player.setVelocityY(-530);
    }

    if(cursors.down.isDown) {
        console.log(player.x);
        emitter.setPosition(player.x, player.y);
        emitter.start();
    }

    //this.cameras.main.scrollX += 1;   
    this.cameras.main.startFollow(player);
    background.tilePositionX += 0.1;
    middleground.tilePositionX += .5;
    foreground.tilePositionX += 1.0;


}

function collectStar(player, star) {
    star.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);

    // Set the position of the emitter
    emitter.setPosition(star.x, star.y); // set the position as per your requirement

    // Start emitting particles
    emitter.start();

    // Set a timer to stop the emitter after a certain duration if necessary
    this.time.addEvent({
        delay: 300, // duration in milliseconds
        callback: stopEmitter,
        callbackScope: this
    });
    
}

// Function to stop the emitter
function stopEmitter() {
    emitter.stop();
}

game.scene.add('GameScene', gameScene);
