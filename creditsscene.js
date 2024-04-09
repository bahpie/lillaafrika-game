var text;
var credits = [
    "Bonusfamiljen produktion presenterar:",
    "",
    "Vägen till Lilla Afrikafestivalen 2024",
    "",
    " En inbjudan till årets festival",
    "",
    "Ljud och Grafik - Magnus Hansson",
    "",
    "Programmering - Björn Öhnell",
    "",
    "",
    "",
    "Nuvarande highscore:",
    ""

];

var yOffset = 400;
var speed = .5;


var CreditsScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "CreditsScene" });
    },
    init: function() {},
    preload: function() {
        databaseUrl = "https://afrikafestivalen-highscore-7ce0ff5024d7.herokuapp.com"
//        console.log("location: " + databaseUrl)
    },
    create: function() {
        this.makeFetchRequest(databaseUrl + "/get");
        this.timedEvent = this.time.addEvent({ delay: 20, callback: this.updateCredits, callbackScope: this, loop: true });
    
    },
    update: function() {
        console.log("credit update");

    },

    updateCredits: function() {
        if (yOffset > -text.height) {
            yOffset -= speed;
        } else {
            // restart the scene or end the game
            // game.scene.start('MainMenu'); // example restart scene
        }
        text.setText(credits.join('\n')).setFontSize('24px').setPosition(10, yOffset);
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
   //             console.log(data); // Handle the data here
                scores = JSON.parse(data)
                for(row in scores) {
                    console.log(scores[row]);
                    credits.push(row + " - " + scores[row] + "\r\n");                 
                    text = this.add.text(0, 0, '', { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff' });
                }

            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }
});