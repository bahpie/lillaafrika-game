var text;
var credits = [
"                           Tack för i år!",
"",
"",
"                         De som spelade var:",
""
];

var yOffset = 600;
var speed = .1;


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
    
    },
    update: function() {
        console.log("credit update");

    },

    updateCredits: function() {
        yOffset -= speed;
        text.setText(credits.join('\n')).setFontSize('24px').setPosition(300, yOffset);
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
                    credits.push("                             " + row + " - " + scores[row] + "\r\n");                 
                    this.timedEvent = this.time.addEvent({ delay: 20, callback: this.updateCredits, callbackScope: this, loop: true });
                    text = this.add.text(0, 0, '', { fontFamily: 'Tahoma', fontSize: '32px', color: '#ffffff' });
                }

            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }
});