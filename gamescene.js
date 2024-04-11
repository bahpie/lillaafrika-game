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
        this.load.spritesheet('volvo', 'assets/245sheet.png', { frameWidth: 128, frameHeight: 64 });
        this.load.image('road', 'assets/road.png');
        this.load.image('star', 'assets/potato64.png');
        this.load.image('particle', 'assets/potato24.png');
        this.load.image('mosquito', 'assets/mosquito.png');
        this.load.image('platform', 'assets/platform.png');
        this.load.image('rocket', 'assets/rocket.png');
        this.load.spritesheet('tractor', 'assets/tractor.png', {frameWidth: 128, frameHeight: 96});


    this.load.audio('bgmusic', 'assets/tune.mp3');
    this.load.audio('mosquito', 'assets/mosquito.mp3');
    this.load.audio('tractor', 'assets/tractor.wav');
    },

    create: function() {
        music = this.sound.add('bgmusic');
        music.play({ loop: true });

        mosquitoSound = this.sound.add('mosquito');
        tractorSound = this.sound.add('tractor');

        this.cameras.main.setBounds(0, 0, trackLength, 500);
        this.physics.world.setBounds(0, 0, trackLength, 500);


        background = this.add.tileSprite(0, 150, trackLength*2 + 50, 894, 'sky');
        middleground = this.add.tileSprite(0, 200, trackLength*2 + 50, 770, 'mountains');
        foreground = this.add.tileSprite(0, 300, trackLength*2 + 50, 482, 'trees');


        //Generate road
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
                y = Math.min(y, 500);
            }
            platforms.create(i, 470,'platform').setScale(1).refreshBody();
                        
            road = this.add.sprite(i,y, 'road');

            previousPlatform = y;
        }
    
        player = this.physics.add.sprite(200, 0, 'volvo').setScale(1.5);
        player.setBounce(0.1);
    
        tractor = this.physics.add.sprite(700,100,'tractor');

        // Create an animation manager for the sprite
        anims = this.anims;

        // Define an animation
        anims.create({
            key: 'running',
            frames: anims.generateFrameNumbers('tractor', { start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });

        anims.create({
            key:'driving',
            frames: anims.generateFrameNumbers('volvo', {start:0, end:4}),
            frameRate:10,
            repeat:-1
        })

        anims.create({
            key:'crashing',
            frames: anims.generateFrameNumbers('volvo', {start:5, end:9}),
            frameRate:8
        })

        anims.create({
            key:'flying',
            frames: anims.generateFrameNumbers('volvo', {start:10, end:14}),
            frameRate:10,
            repeat:-1
        })


        player.anims.play('driving', true);


        stars = this.physics.add.group({
            key: 'star',
            repeat: 30,
            setXY: { x: 12, y: 300, stepX: 280 }
        });
    
        stars.children.iterate(function (child) {
            child.setBounceY(0);
        });
        
        rocket = this.physics.add.sprite(1100, 200, 'rocket');
   
        score = 0;
        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#eee' });
        scoreText.setScrollFactor(0);
        
  
        this.input.on('pointerdown', function(pointer) {
            // Handle pointer down event here
            if(player.body.blocked.down && pointer.worldX > player.x) {
                player.setVelocityY(-400);
                player.setVelocityX(160)
            } else if (rocketFuel > 0) {
                isBoosting = true;
            } else if(pointer.worldX < player.x) {
                //player.setVelocityX(50)
            }
        }, this);

        this.input.on('pointerup', function(pointer) {
            isBoosting = false;
            console.log(pointer.worldX);
            this.updateRocketBar();
        }, this);



        this.input.on('pointermove', function(pointer) {
            console.log('Pointer position - X: ' + pointer.x + ', Y: ' + pointer.y);
            if(isBoosting) {
                //player.setVelocityX(120);
                player.setVelocityY(pointer.y- player.y);
                rocketFuel = Math.max(rocketFuel - 10, 0);
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

        rocketBar = this.add.graphics();
        this.updateRocketBar();
        rocketBar.setScrollFactor(0);

        mosquito = this.physics.add.sprite(800, Phaser.Math.Between(0, 300), 'mosquito');
        mosquito.setVelocity(-100, 0); // Set the obstacle's initial velocity

        this.physics.add.collider(player, mosquito, this.hitMosquito, null, this);
        this.physics.add.collider(player, platforms);
        this.physics.add.collider(player, rocket, this.collectRocket, null, this);
        this.physics.add.collider(player, tractor, this.hitTractor, null, this);
        this.physics.add.collider(stars, platforms);
        this.physics.add.collider(player, stars, this.collectStar, null, this);
        this.physics.add.collider(rocket, platforms);
        this.physics.add.collider(tractor, platforms);
        tractorCollider = this.physics.add.collider(tractor, stars, this.destroyStar, null, this);

    },

    update: function() {

        //this.cameras.main.scrollX += 1;   
        this.cameras.main.startFollow(player);
        background.tilePositionX += 0.0;
        middleground.tilePositionX += .1;
        foreground.tilePositionX += 0.2;

        if(player.x > trackLength) {
            console.log("End of the road...");
            this.endGame();
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
                //mosquitoSound.play();
            }
        } else {
            mosquitoSound.stop();
        }

        if(score < 0) {
            score = 0;
        }

        if(player.x > tractor.x) {
            //tractor.setVelocityX(40); 
            if(!tractorSound.isPlaying) {
                tractorSound.play();
            }
            tractor.anims.play('running', true);
            
            var timedEvent = this.time.addEvent({
                delay: 3000, // delay in milliseconds
                callback: this.secondGearEvent, // callback function to execute
                callbackScope: this, // scope of the callback function (the scene in this case)
                loop: false // set to true if you want the event to repeat
            });
        }
    },

    collectStar: function(player, star) {

        score += 10;
        scoreText.setText('Score: ' + score);

        star.destroy();

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

    destroyStar: function(tractor, star) {
        star.setPosition(0,0)
        star.destroy()
    },

    collectRocket: function(player, rocket) {
        rocketFuel = 1000;
        rocket.disableBody(true, true);
        this.updateRocketBar();
        player.anims.play('flying', true);
    },

    hitTractor: function(player, tractor) {
        if(player.y > tractor.y - 20) {
            tractor.setVelocityX(0);
            player.setVelocityX(0)
            player.anims.play('crashing', true);
            setTimeout(this.endGame(), 1000);                
        }
    },


    updateRocketBar : function() {
        console.log(rocketFuel);
  
        rocketBar.clear();
        // Set the fill style of the power bar
        rocketBar.fillStyle(0xbbbbbb);
    
        // Draw the power bar
        rocketBar.fillRect(47, 47, 16, 206);
        
        // Set the fill style of the power bar
        rocketBar.fillStyle(0x00ff00);
    
        // Draw the power bar
        rocketBar.fillRect(50, 250 - rocketFuel/5, 10, rocketFuel/5);

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

    endGame: function() {
        let playerName = prompt("Please enter your name", "Spelare Spelarsson");
        if (playerName != null) {
            console.log(playerName);
            databaseUrl = "https://afrikafestivalen-highscore-7ce0ff5024d7.herokuapp.com"
            this.makeFetchRequest(databaseUrl + "/put?name="+playerName+"&score="+score);
        }
        this.scene.start('CreditsScene');
    },

    secondGearEvent: function() {
        tractor.setVelocityX(200);
    },

    makeFetchRequest: async function(url) {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                console.log(data); // Handle the data here

            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

});