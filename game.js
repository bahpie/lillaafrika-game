var config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
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

function preload() {
    this.load.image('sky', 'assets/mountains-back.png');
    this.load.image('mountains', 'assets/mountains-mid1.png');
    this.load.image('trees', 'assets/mountains-mid2.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 64, frameHeight: 96 });

    this.load.audio('bgmusic', 'assets/tune.mp3');
}

function create() {
    this.backgroundColor = '#697e96';

    music = this.sound.add('bgmusic');
    music.play({ loop: true });

    background = this.add.tileSprite(0, 768-894+250, 2048, 894, 'sky');
    middleground = this.add.tileSprite(0, 768-770+250, 2048, 770, 'mountains');
    foreground = this.add.tileSprite(0, 768-482+250, 2048, 482, 'trees');

//    platforms = this.physics.add.staticGroup();
//    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    player = this.physics.add.sprite(0, 500, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();

    this.cameras.main.setBounds(0, 0, 1024* 2, 768);
    this.physics.world.setBounds(0, 0, 1024 * 2, 768);
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        background.tilePositionX -= 0.5;
        middleground.tilePositionX -= 1.5;
        foreground.tilePositionX -= 2.5;
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        background.tilePositionX += 0.5;
        middleground.tilePositionX += 1.5;
        foreground.tilePositionX += 2.5;
    } else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.blocked.down) {
        player.setVelocityY(-330);
    }
}
