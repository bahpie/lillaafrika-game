var text;
var credits = [
    "** Bonusfamiljen produktion presenterar **",
    "Vägen till Lilla Afrikafestivalen 2024",
    "Ljud och Grafik - Magnus Hansson",
    "Programmering - Björn Öhnell",
    "***",
    "",
    "Nuvarande highscore:"
];

var yOffset = 400;
var speed = 1;

var CreditsScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "CreditsScene" });

        this.downloadAndReadCSVFile("https://docs.google.com/spreadsheets/d/e/2PACX-1vTKZCxEtJFZ3MbxEoE_OO5moE2COs-AudBsEbxs8t9GEqERFOCTAxSCb8J2jZ8Jc4P5EHncG-DtUyY4/pub?output=csv");
    },
    init: function() {},
    preload: function() {
        console.log("credit preload");

    },
    create: function() {
        text = this.add.text(0, 0, '', { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff' });

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

    downloadAndReadCSVFile: function(url) {
        // Create a vscode-file://vscode-app/usr/share/code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.htmlnew XMLHttpRequest object
        var xhr = new XMLHttpRequest();
        
        // Set the responseType to "text" for the response to be treated and parsed as plain text
        xhr.responseType = 'text';

        // Define the onload function to handle the response
        xhr.onload = function() {
            if (xhr.status === 200) {
            // If the request was successful, process the data
            var csvData = xhr.responseText;
            console.log(csvData.split(",")); // You can replace this with your own logic to process the CSV data
            credits.push(csvData.split(","));
            } else {
            // If the request was not successful, log the error
            console.error('Request failed. Status: ' + xhr.status);
            }
        };    

    // Open a GET request to the provided URL
    xhr.open('GET', url, true);
  
    // Send the request
    xhr.send();
    }
});