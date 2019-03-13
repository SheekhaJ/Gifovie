'use strict';
const aws = require('aws-sdk');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const https = require('https');
const path = require('path');

module.exports = function (app) {

    aws.config.credentials = credentials;
    aws.config.loadFromPath('config.json');

    var credentials = new aws.SharedIniFileCredentials({ profile: 'default' });
    var s3 = new aws.S3({ credentials });

    app.get('/', function (req, res) {
        // var listFileNames = process.cwd() +"\\"+"list.txt", fileNames = "";
        // console.log('file to store sub-gifovies: '+listFileNames);
        
        // // fileList.forEach(function(fileName, index){
        // //     console.log("fileName: "+fileName);
        // //     fileNames = fileNames + " file " + "'" + fileName + "'\r\n";
        // // });

        // // fs.writeFileSync(listFileNames, fileNames);
        // console.log('path resolve: '+listFileNames);
        // fs.readFile("C:\\Users\\Sheekha\\OneDrive\\OneDrive - Oregon State University\\workspace\\vs workspace\\Gifovie\\list.txt", 'utf8', function(err, data){
        //     // console.log('inside readFileSync!');
        //     if(err)
        //         console.log('error is '+err);
        //     else
        //         console.log('content from resolved path '+listFileNames+' is '+data);
        // });
        
        res.render('pages/welcome');
    });

    app.get('/addGIFs', function (req, res) {
        res.render('pages/addGIFs');
    });

    app.get('/addSounds', function (req, res) {
        var category = req.query.category ? req.query.category : 'funny';
        console.log('category received on backend is ', category);

        var soundsArray = [];
        s3.listObjectsV2({
            Bucket: 'gifovie-bucket',
            Prefix: 'sounds/' + category
        }, function (err, data) {
            if (err) {
                console.log('err in listObjects: ' + err);
            } else {
                // var objects = data.Contents;
                // console.log('in s3.listObjects! category is '+category);
                // console.log(data);
                for (var i = 0; i < data.KeyCount; i++) {
                    var element = data.Contents[i];
                    var name = element.Key
                    if (name.includes('wav')) {
                        var url = s3.getSignedUrl('getObject', {
                            Bucket: data.Name,
                            Key: name
                        });
                        soundsArray.push({ 'name': name.replace('sounds/' + category + '/', '').replace('.wav', ''), 'url': url });
                    }
                }

                var j, x, i;
                for (i = soundsArray.length - 1; i > 0; i--) {
                  j = Math.floor(Math.random() * (i + 1));
                  x = soundsArray[i];
                  soundsArray[i] = soundsArray[j];
                  soundsArray[j] = x;
                }
                
            }
            // console.log('\n sounds are ' + JSON.stringify(soundsArray));
            res.render('pages/addSounds', { sounds: soundsArray, category: category });
        });
    });

    var sound = function(url, dest, callback){
        var file = fs.createWriteStream(dest);
        var request = https.get(url, function(response){
            response.pipe(file);
            file.on('finish', function(){
                file.close(callback);
            });
        }).on('error', function(err){
            fs.unlink(dest);
            if(callback)
                callback(err.message);
        });
    }

    var soundDownloaded = function(err){
        console.log('sound has been downloaded and callback function has been called.');
        if (err)
            console.error('error is '+err.message);
    }

    app.get('/reviewGIFovie', function (req, res) {
        var gifurls = req.cookies['gifURLs'].split("_");
        // console.log("gifURLs: "+gifurls);

        var soundurls = req.cookies['soundURLs'].split("_");
        // console.log("soundURLs: "+soundurls);
        
        var gifovieMap = new Map();

        gifurls.forEach(function(value, index){
            if (value != 'null' && soundurls[index] != 'null')
                gifovieMap.set('gifovie'+index, [gifurls[index], soundurls[index]]);
            else if (value != 'null' && soundurls[index] == 'null'){
                console.log("gifurl!=null but no sound has been selected! ")
                var category = "random";
                var soundsArray = [];
                s3.listObjectsV2({
                    Bucket: 'gifovie-bucket',
                    Prefix: 'sounds/' + category
                }, function (err, data) {
                    if (err) {
                        console.log('err in listObjects: ' + err);
                    } else {
                        // var objects = data.Contents;
                        // console.log('in s3.listObjects! category is '+category);
                        // console.log(data);
                        for (var i = 0; i < data.KeyCount; i++) {
                            var element = data.Contents[i];
                            var name = element.Key
                            if (name.includes('wav')) {
                                var url = s3.getSignedUrl('getObject', {
                                    Bucket: data.Name,
                                    Key: name
                                });
                                soundsArray.push({ 'name': name.replace('sounds/' + category + '/', '').replace('.wav', ''), 'url': url });
                            }
                        }
        
                        var j, x, i;
                        for (i = soundsArray.length - 1; i > 0; i--) {
                          j = Math.floor(Math.random() * (i + 1));
                          x = soundsArray[i];
                          soundsArray[i] = soundsArray[j];
                          soundsArray[j] = x;
                        }
                        
                    }
                });

                soundurls[index] = soundsArray.pop();
                // console.log('sounds: '+soundurls[index]);
            }
        });

        console.log("gifovieMap length: "+gifovieMap.size);

        function mergeGIFAndSoundFiles(gifovieMap){
            return new Promise(function(resolve, reject){
                var mp4Exists = [];
                gifovieMap.forEach(function(value, key){
                        console.log('gif url is '+(value[0].includes("tenor") && value[0].includes(".gif") ? value[0] : null));
                        console.log('sound url is '+(value[1].includes("s3") && value[1].includes(".wav") ? value[1] : null));
                        
                        var s = sound(value[1], key+'.wav', soundDownloaded);
            
                        ffmpeg()
                        .on('start', function(){
                            console.log("ffmpeg spawned!");
                        })
                        .addInput(value[0].includes("tenor") && value[0].includes(".gif") ? value[0] : null)
                        // .addInput(value[1].includes("s3") && value[1].includes(".wav") ? value[1] : null)
                        // .addInput('car-horn.wav')
                        .addInput(key+'.wav')
                        .on('progress', function(progress){
                            console.log("processing!");
                        })
                        .on('end', function(){
                            console.log("merge process with ffmpeg ended!")
                        })
                        .duration(3)
                        .saveToFile(key+'.mp4', function(stdout, stderr){
                            console.log("File combined and saved successfully!");
                            mp4Exists.push(key+'.mp4');
                        });
                    });

                mp4Exists.forEach(function(value, key){
                    if(fs.exists(value))
                        resolve(value+' has been created!');
                    else
                        reject('merging gif with sound failed for '+key);
                });
            });
        }

        mergeGIFAndSoundFiles(gifovieMap)
        .then(function(){
            console.log("Called after promise!");
        }).catch(function(err){
            console.log("Catching error! Error: "+err);
        })

        // gifovieMap.forEach(function(value, key){
        //     // console.log('key is '+key+' value is '+value);
        //     console.log('gif url is '+(value[0].includes("tenor") && value[0].includes(".gif") ? value[0] : null));
        //     console.log('sound url is '+(value[1].includes("s3") && value[1].includes(".wav") ? value[1] : null));
            
        //     var s = sound(value[1], key+'.wav', soundDownloaded);

        //     ffmpeg()
        //     .on('start', function(){
        //         console.log("ffmpeg spawned!");
        //     })
        //     .addInput(value[0].includes("tenor") && value[0].includes(".gif") ? value[0] : null)
        //     // .addInput(value[1].includes("s3") && value[1].includes(".wav") ? value[1] : null)
        //     // .addInput('car-horn.wav')
        //     .addInput(key+'.wav')
        //     .on('progress', function(progress){
        //         console.log("processing!");
        //     })
        //     .on('end', function(){
        //         console.log("merge process with ffmpeg ended!")
        //     })
        //     .duration(3)
        //     .saveToFile(key+'.mp4', function(stdout, stderr){
        //         console.log("File combined and saved successfully!");
        //     });
        // });

        console.log("Entering gifovie combine phase!");

        var fileList = [];
        gifovieMap.forEach(function(value, key){
            fileList.push(key+".mp4");
        })

        console.log('filelist names: '+fileList);
        
        var listFileNames = process.cwd() +"\\list.txt", fileNames = "";
        console.log('file to store sub-gifovies: '+listFileNames);
        
        // fileList.forEach(function(fileName, index){
        //     console.log("fileName: "+fileName);
        //     fileNames = fileNames + " file " + "'" + fileName + "'\r\n";
        // });

        // fs.writeFileSync(listFileNames, fileNames);

        // ffmpeg()
        // // .on('start', function(){
        // //     console.log('in ffmpeg combine phase! listFileNames: '+listFileNames);
        // //     fs.readFile(listFileNames, function(err, data){
        // //         console.log("content from list.txt is "+data);
        // //     });
        // // })
        // .input('list.txt')
        // .inputOptions(['-f concat', '-safe 0'])
        // .outputOptions('-c copy')
        // .save('gifovie.mp4');

        res.render('pages/reviewGIFovie');
    });
};
