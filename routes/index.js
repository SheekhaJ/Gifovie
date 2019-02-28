'use strict';
const aws = require('aws-sdk');

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
                        // console.log('key is ' + name);
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
        res.render('pages/reviewGIFovie');
    });
};
