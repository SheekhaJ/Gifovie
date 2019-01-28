var ffmpeg = require('fluent-ffmpeg');

var med = new ffmpeg({source: 'tenor.gif'})
.on('start', function(commandLine){
    console.log('Spawned ffmpeg with '+commandLine)
})
.addInput('hahaha.wav').saveToFile('media.mp4', function(stdout, stderr){
    console.log('new media with gif and wav has been created successfully.');
});