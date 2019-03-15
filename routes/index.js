'use strict';
const aws = require('aws-sdk');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const https = require('https');
const path = require('path');
const url = require('url');
const exec = require('child_process').exec;

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

    var getRandomSound = function(){
        const path = "./sounds/random/";
    
        var numberOfFiles = fs.readdirSync(path).length;
        console.log("Random sound file: "+path+fs.readdirSync(path)[Math.floor(Math.random() * Math.floor(numberOfFiles))]);
        return path+fs.readdirSync(path)[Math.floor(Math.random() * Math.floor(numberOfFiles))];
    }

    var sound = function (url, dest, callback) {
        var file = fs.createWriteStream(dest);
        var request = https.get(url, function (response) {
            response.pipe(file);
            // file.on('end', function () {
            //     file.close(callback);
            // });
            setTimeout(() => {
                file.on('end', function () {
                    file.close(callback);
                });
                console.log('sleep callback while downloading sound!')
            }, 2000);
        }).on('error', function (err) {
            file.unlink(dest);
            console.log('error while downloading sound is ' + err);
        });
    }

    var soundDownloaded = function () {
        console.log('sound has been downloaded and callback function has been called.');
    }

    app.get('/reviewGIFovie', function (req, res) {
        var gifurls = req.cookies['gifURLs'].split("_");
        // console.log("gifURLs: "+gifurls);

        var soundurls = req.cookies['soundURLs'].split("_");
        // console.log("soundURLs: "+soundurls);

        var gifovieMap = new Map();

        gifurls.forEach(function (value, index) {
            if (value != 'null' && soundurls[index] != 'null')
                gifovieMap.set('gifovie' + index, [gifurls[index], soundurls[index]]);
            else if (value != 'null' && soundurls[index] == 'null') {
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

        console.log("gifovieMap length: " + gifovieMap.size);

        function mergeGIFAndSoundFiles(gifovieMap) {
            return new Promise(function (resolve, reject) {
                gifovieMap.forEach(function (value, key) {
                    var gifURL = (value[0].includes("tenor") && value[0].includes(".gif") ? value[0] : null);
                    var soundURL = (value[1].includes("s3") && value[1].includes(".wav") ? value[1] : null);
                    console.log('gif url is ' + gifURL);
                    console.log('sound url is ' + soundURL);

                    var s = sound(soundURL, key + '.wav', soundDownloaded)
                    var soundFileName = key + '.wav';
                    ffmpeg()
                        .on('start', function () {
                            console.log("ffmpeg spawned!");
                        })
                        .addInput(gifURL)
                        .addInput(soundFileName)
                        .on('progress', function (progress) {
                            console.log("processing!");
                        })
                        .on('error', function (err) {
                            console.error('error while combining gif with sound! ' + err);

                            var randomSound = getRandomSound();
                            ffmpeg()
                                .on('start', function () {
                                    console.log('trying to merge after downloading the sound again!');
                                })
                                .addInput(gifURL)
                                .addInput(randomSound)
                                .on('end', function () {
                                    console.log("merge process with ffmpeg ended!");
                                    fs.unlinkSync(soundFileName, function (err) {
                                        if (err) console.log('In deleting file err ' + err);
                                        else console.log('file deleted successfully!');
                                    });
                                }).on('error', function () {
                                    reject("Could not download sound the second time!");
                                })
                                .duration(3)
                                .saveToFile(key + '.mp4');
                        })
                        .on('end', function () {
                            console.log("merge process with ffmpeg ended!");
                            fs.unlinkSync(soundFileName, function (err) {
                                if (err) console.log('In deleting file err ' + err);
                                else console.log('file deleted successfully!');
                            });
                            resolve(key + '.mp4');
                        })
                        .duration(3)
                        .saveToFile(key + '.mp4');
                });
            });
        }

        mergeGIFAndSoundFiles(gifovieMap)
            .then(function (value) {
                console.log("inside then after promise ended! value is " + value);
                gifovieMap.forEach(function (value, key) {
                    fs.accessSync(key + '.mp4', fs.R_OK, function (err) {
                        console.log(key + '.mp4 has been created!');
                    });
                });
                console.log("Called after promise!");
            })
            .then(mergeMP4Files)
            .catch(function (err) {
                console.log("Catching error! Error: " + err);
            }).finally(function () {
                console.log("In finally at end of promise!");
                // gifovieMap.forEach(function (value, key) {
                //     // setTimeout(() => { console.log('sleep callback') }, 2000);
                //     fs.access(key + '.mp4', fs.R_OK, function (err) {
                //         console.log("Deleting " + key + ".mp4 file!");
                //         fs.unlink(key + '.mp4', function (err) {
                //             console.log('error while deleting ' + key + '.mp4. Err: ' + err);
                //         });
                //     });
                // });
            });

        var mergeMP4Files = function () {
            console.log("Entering gifovie combine phase!");

            var fileList = [];
            gifovieMap.forEach(function (value, key) {
                fileList.push(key + ".mp4");
            })

            console.log('filelist names: ' + fileList);

            var listFileNames = process.cwd() + "\\list.txt", fileNames = "";
            console.log('file to store sub-gifovies: ' + listFileNames);

            fileList.forEach(function (fileName, index) {
                console.log("fileName: " + fileName);
                fileNames = fileNames + " file " + "'" + fileName + "'\r\n";
            });

            fs.writeFileSync(listFileNames, fileNames);

            ffmpeg()
                .on('start', function () {
                    console.log('in ffmpeg combine phase! listFileNames: ' + listFileNames);
                    fs.readFileSync(listFileNames, function (err, data) {
                        console.log("content from list.txt is " + data);
                    });
                })
                .input('list.txt')
                .inputOptions(['-f concat', '-safe 0'])
                .outputOptions('-c copy')
                .save('gifovie.mp4');
        }

        res.render('pages/reviewGIFovie');
    });
};
