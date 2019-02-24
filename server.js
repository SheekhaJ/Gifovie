const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const aws = require('aws-sdk');

const app = express();
var port = 3000

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

aws.config.loadFromPath('config.json');

var credentials = new aws.SharedIniFileCredentials({ profile: 'default' });
aws.config.credentials = credentials;
var s3 = new aws.S3({ credentials });



app.get('/', function (req, res) {
    console.log('current file: '+__filename);
    console.log('current dir: '+__dirname);
    
    // for(const key in req.query){
    //     console.log('key: '+key+' param:'+req.query[key]);
    // }

    // if (req.query.category) {
        category = req.query.category ? req.query.category : 'funny';
        console.log('category received on backend is ', category);
        
        var soundsArray = [];
        // var soundsMap = new Map();
        s3.listObjectsV2({
            Bucket: 'gifovie-bucket',
            Prefix: 'sounds/' + category
        }, function (err, data) {
            if (err) {
                console.log('err in listObjects: ' + err);
            } else {
                // var objects = data.Contents;
                // console.log('in s3.listObjects! category is '+category);
                for (i = 0; i < data.KeyCount; i++) {
                    var element = data.Contents[i];
                    var name = element.Key
                    if (name.includes('wav')) {
                        // console.log('key is ' + name);
                        var url = s3.getSignedUrl('getObject', {
                            Bucket: data.Name,
                            Key: name
                        });
                        soundsArray.push({ 'name': name.replace('sounds/'+category+'/', '').replace('.wav',''), 'url': url });
                    }
                }
            }
            console.log('\n sounds are '+JSON.stringify(soundsArray));
            res.render('index', { sounds: soundsArray, category:category });
        });
    // }

    // if(req.query.data) {
    //     console.log('in backend data is ' + data);
    // }
});


app.listen(port, function () {
    console.log('App running on ' + port + ' port.');
});
