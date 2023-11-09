var GameScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "GameScene" });
    },
    init: function() {},
    preload: function() {
        this.load.image('sky', 'assets/mountains-back.png');
        this.load.image('mountains', 'assets/mountains-mid1.png');
        this.load.image('trees', 'assets/mountains-mid2.png');
        this.load.spritesheet('volvo', 'assets/caranim.png', { frameWidth: 128, frameHeight: 64 });
        this.load.image('road', 'assets/road.png');
        this.load.image('star', 'assets/potato64.png');
        this.load.image('particle', 'assets/potato24.png');
        this.load.image('mosquito', 'assets/mosquito.png');
        this.load.image('platform', 'assets/platform.png');
        this.load.image('rocket', 'assets/rocket.png');


    this.load.audio('bgmusic', 'assets/tune.mp3');false
    this.load.audio('mosquito', 'assets/mosquito.mp3');
    },

    create: function() {
        music = this.sound.add('bgmusic');
        music.play({ loop: true });

        mosquitoSound = this.sound.add('mosquito');

        this.cameras.main.setBackgroundColor('#87CEEB')

        background = this.add.tileSprite(0, 150, trackLength*2 + 50, 894, 'sky');
        middleground = this.add.tileSprite(0, 200, trackLength*2 + 50, 770, 'mountains');
        foreground = this.add.tileSprite(0, 300, trackLength*2 + 50, 482, 'trees');

        platforms = this.physics.add.staticGroup();

        var previousPlatform = 460;
        for(i = 0; i< trackLength+50;i+=60) {
            var y = 0;
            while(y < previousPlatform - 140) {
                var rnd = Math.random();
                if(rnd > .55) {            
                    platforms.create(i,y + 20,'platform').setScale(1).refreshBody();
                    y = previousPlatform + 5;
                } else if(rnd < 0.45) {
                    y = previousPlatform - 5;
                } else {
                    y = previousPlatform;
                }
                y = Math.max(y, 460);
                y = Math.min(y, 550);
            }
            platforms.create(i, 470,'platform').setScale(1).refreshBody();
            
            
            road = this.add.sprite(i,y, 'road');


            previousPlatform = y;
        }
    
        player = this.physics.add.sprite(200, 0, 'volvo');
        player.setBounce(0.1);
        player.setCollideWorldBounds(false);

        this.physics.add.collider(player, platforms);
    
    
        cursors = this.input.keyboard.createCursorKeys();
    
        this.cameras.main.setBounds(0, 0, trackLength, 500);
        this.physics.world.setBounds(0, 0, trackLength, 500);
    
        stars = this.physics.add.group({
            key: 'star',
            repeat: 30,
            setXY: { x: 12, y: 300, stepX: 140 }
        });
    
        stars.children.iterate(function (child) {
            child.setBounceY(0);
        });
        
        rocket = this.physics.add.sprite(800, 200, 'rocket');


        this.physics.add.collider(player, rocket, this.collectRocket, null, this);
        this.physics.add.collider(stars, platforms);
        this.physics.add.collider(player, stars, this.collectStar, null, this);
        this.physics.add.collider(rocket, platforms);

    
        score = 0;
        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#FFF' });
        scoreText.setScrollFactor(0);
    
  
        this.input.on('pointerdown', function(pointer) {
            // Handle pointer down event here
            if(player.body.blocked.down && pointer.worldX > player.x) {
                player.setVelocityY(-400);
                player.setVelocityX(120)
                console.log(hasRocket);
            } else if (hasRocket) {
                isBoosting = true;
            } else if(pointer.worldX < player.x) {
                player.setVelocityX(50)
            }
        }, this);

        this.input.on('pointerup', function(pointer) {
            isBoosting = false;
            console.log(pointer.worldX);
        }, this);



        this.input.on('pointermove', function(pointer) {
            console.log('Pointer position - X: ' + pointer.x + ', Y: ' + pointer.y);
            if(isBoosting) {
                var velX = Math.max(pointer.x - player.x, 0) * 5;
                player.setVelocityX(160);
                player.setVelocityY(pointer.y- player.y);
            }
        });

        player.setVelocityX(160);
   
        particles = this.add.particles('particle');
    
        // Customize the particle emitter properties
        emitter = particles.createEmitter({
            speed: 100,
            scale: { start: 2, end: 0 },
            blendMode: 'ADD'
        });
    
        emitter.stop();
    
        var textConfig = {
            color: '#ffffff',
            fontSize: '48px'
        };

        mosquito = this.physics.add.sprite(800, Phaser.Math.Between(0, 300), 'mosquito');
        mosquito.setVelocity(-100, 0); // Set the obstacle's initial velocity
        mosquitoSound.play();

        this.physics.add.collider(player, mosquito, this.hitMosquito, null, this);
    
    },

    update: function() {

        //this.cameras.main.scrollX += 1;   
        this.cameras.main.startFollow(player);
        background.tilePositionX += 0.0;
        middleground.tilePositionX += .1;
        foreground.tilePositionX += 0.2;

        if(player.x > trackLength) {
            console.log("End of the road...")
            mosquitoSound.stop();
            this.queryName();
            this.scene.start('CreditsScene');
        }

        if (mosquito.x < 0) {
            mosquito.x = player.x + 500;
            mosquito.y = Phaser.Math.Between(0, 300);
        } 
        
        if(mosquito.y < 20){
            mosquito.setVelocityY(0);
        } else if(mosquito.y > 400) {
            mosquito.setVelocityY(Math.random() * 500 - 800);
        }
        
        
        //Check if the sprite is inside the camera's viewport
        if (this.cameras.main.worldView.contains(mosquito.x, mosquito.y)) {
            if(!mosquitoSound.isPlaying) {
                mosquitoSound.play();
            }
        } else {
            mosquitoSound.stop();
        }

        if(score < 0) {
            score = 0;
        }
    },

    collectStar: function(player, star) {

        star.disableBody(true, true);
        score += 10;
        scoreText.setText('Score: ' + score);

        // Set the position of the emitter
        emitter.setPosition(star.x, star.y); // set the position as per your requirement

        // Start emitting particles
        emitter.start();

        player.setVelocityX(160);

        // Set a timer to stop the emitter after a certain duration if necessary
        this.time.addEvent({
            delay: 300, // duration in milliseconds
            callback: this.stopEmitter,
            callbackScope: this
        });
        
    },

    collectRocket: function(player, rocket) {
        hasRocket = true;
        rocket.disableBody(true, true);
    },

    stopEmitter: function() {
        emitter.stop();
    },

    hitMosquito: function() {
        score -= 50;
        mosquito.x = player.x + 800;
        mosquito.setVelocityX(-100);
        mosquitoSound.stop();

    },

    queryName: function() {
        let playerName = prompt("Please enter your name", "Spelare Spelarsson");
        if (person != null) {
            console.log(playerName);
        }
    }

});