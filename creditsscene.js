var text;
const credits = [
    "** Bonusfamiljen produktion presenterar **",
    "Vägen till Lilla Afrikafestivalen 2024",
    "Ljud och Grafik - Magnus Hansson",
    "Programmering - Björn Öhnell",
    "***",
    "Tack till..."
];
var yOffset = 400;
var speed = 1;

var CreditsScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "CreditsScene" });
    },
    init: function() {},
    preload: function() {
        console.log("credit preload");

    },
    create: function() {
        text = this.add.text(0, 0, '', { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff' });

        this.timedEvent = this.time.addEvent({ delay: 20, callback: this.updateCredits, callbackScope: this, loop: true });
        console.log("credit create");
    
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
    }
});