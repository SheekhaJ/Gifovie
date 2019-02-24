const ff = require('fluent-ffmpeg');
var fs = require('fs');

// ff().
// on('start', function(commandLine){
//     console.log('ffmpeg spawned!');
// })
// .addInput('https://media.tenor.com/images/a9f723331f2d2c1640a6e155364e55e9/tenor.gif')
// // .addInput("https://media.tenor.com/images/42251c97db0aa9bfa0e2674c97e693ca/tenor.gif")
// .addInput('car-horn.wav')
// //.addInput('https://media.tenor.com/images/612312ec7a29a2366539bb20e97fca82/tenor.gif')
// // .on('progress', function(progress){
// //     console.log('Processing '+progress.percent+'% done!');
// // })
// .on('end', function(){
//     console.log('Process ended!');
// })
// // .duration(3)
// .saveToFile('output.mp4', function(stdout, stderr){
//     console.log('File combined and saved successfully!');
// });

//cmd to concat two mp4 files
//(echo file 'output.mp4' & echo file 'newoutput.mp4') > list.txt
//ffmpeg -safe 0 -f concat -i list.txt -c copy final.mp4

var fileList = ['output.mp4', 'newoutput.mp4'];
var listFileNames = 'filelist.txt', fileNames = '';

fileList.forEach(function(fileName, index){
    console.log('filename: '+fileName);
    fileNames = fileNames + ' file ' + "'" + fileName + '\'\r\n';
});

fs.writeFileSync(listFileNames, fileNames);

var combine = ff().input(listFileNames)
.inputOptions(['-f concat', '-safe 0'])
.outputOptions('-c copy')
.save('codeoutput.mp4');

// ff().
// on('start', function(commandLine){
//     console.log('combining mp4!');
// })
// .concat()
// .addInput('newoutput.mp4')
// .addInput('output.mp4')
// .on('end', function(){
//     console.log('Process ended!');
// })
// .on('error', function(err){
//     console.log('error occured: '+err);
// })
// .mergeToFile('./combined.mp4', './temp/');