'use strict';
const aws = require('aws-sdk');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

module.exports = function (app) {

    aws.config.credentials = credentials;
    aws.config.loadFromPath('config.json');

    var credentials = new aws.SharedIniFileCredentials({ profile: 'default' });
    var s3 = new aws.S3({ credentials });

    app.get('/', function (req, res) {
        
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
                console.log(data);
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
            console.log('\n sounds are ' + JSON.stringify(soundsArray));
            res.render('pages/addSounds', { sounds: soundsArray, category: category });
        });
        // res.render('pages/addSounds', { sounds: soundsArray, category: category });
    });

    app.get('/reviewGIFovie', function (req, res) {
        var gifurls = req.cookies['gifURLs'].split("_");
        // console.log("gifURLs: "+gifurls);

        var soundurls = req.cookies['soundURLs'].split("_");
        // console.log("soundURLs: "+soundurls);

        // var gifurls = "https://media.tenor.com/images/bd05c1611762e65ee614e43f5422f57f/tenor.gif_https://media.tenor.com/images/5b6c59d084c421486b907102b260536f/tenor.gif_null_null".split("_");
        console.log("gifURLs: "+gifurls);

        // var soundurls = "https://gifovie-bucket.s3.us-west-2.amazonaws.com/sounds/funny/LongBurp.wav?AWSAccessKeyId=AKIAJNY3GON2EE4DM7LA&Expires=1552028173&Signature=N3sASBxioUQWx/P9bgk2eCVHxTU=_https://gifovie-bucket.s3.us-west-2.amazonaws.com/sounds/funny/MaleLaugh.wav?AWSAccessKeyId=AKIAJNY3GON2EE4DM7LA&Expires=1552028173&Signature=GGbk/RqLvazOabQX6HdiLH+nmt0=_null_null".split("_");
        console.log("soundURLs: "+soundurls);

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
                console.log('sounds: '+soundurls[index]);
            }
        });

        console.log("gifovieMap length: "+gifovieMap.size);

        gifovieMap.forEach(function(value, key){
            console.log('key is '+key+' value is '+value);
            console.log('gif url is '+(value[0].includes("tenor") && value[0].includes(".gif") ? value[0] : null));
            console.log('sound url is '+(value[1].includes("s3") && value[1].includes(".wav") ? value[1] : null));

            ffmpeg()
            .on('start', function(){
                console.log("ffmpeg spawned!");
            })
            .addInput(value[0].includes("tenor") && value[0].includes(".gif") ? value[0] : null)
            //.addInput(value[1].includes("s3") && value[1].includes(".wav") ? value[1] : null)
            .addInput('car-horn.wav')
            .on('progress', function(progress){
                console.log("processing!");
            })
            .on('end', function(){
                console.log("merge process with ffmpeg ended!")
            })
            .duration(3)
            .saveToFile(key+'.mp4', function(stdout, stderr){
                console.log("File combined and saved successfully!");
            });
        });

        console.log("Entering gifovie combine phase!");

        var fileList = [];
        // ["gifovie0.mp4", "gifovie1.mp4", "gifovie2.mp4", "gifovie3.mp4"];
        gifovieMap.forEach(function(value, key){
            fileList.push(key+".mp4");
        })

        console.log('filelist names: '+fileList);
        
        var listFileNames = __dirname +"\\"+"files.txt", fileNames = "";
        fileList.forEach(function(fileName, index){
            console.log("fileName: "+fileName);
            fileNames = fileNames + " file " + "'" + fileName + "'\r\n";
        });

        fs.writeFileSync(listFileNames, fileNames);

        ffmpeg().input(listFileNames)
        .inputOptions(['-f concat', '-safe 0'])
        .outputOptions('-c copy')
        .save('gifovie.mp4');

        for(var key of gifovieMap.keys()){
            console.log('key is '+key+'; value is '+gifovieMap.get(key));
        }
        

        res.render('pages/reviewGIFovie');
    });
};
