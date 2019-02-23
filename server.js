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

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

var s3 = new aws.S3({ accessKeyId: 'AKIAIYGRY4FCAO52RY6A', secretAccessKey: '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' })

var soundsArray = [];

app.get('/', cors(corsOptions), function (req, res) {
    category = req.query.category ? req.query.category : 'funny';
    console.log('category received on backend is ', category);

    // var soundsMap = {};
    s3.listObjectsV2({
        Bucket: 'gifovie-bucket',
        Prefix: 'sounds/'+category
    }, function (err, data) {
        if (err) {
            console.log('err: ' + err);
        } else {
            // var objects = data.Contents;
            // console.log('in s3.listObjects! category is '+category);
            for (i = 0; i < data.KeyCount; i++) {
                var element = data.Contents[i];
                var name = element.Key
                if (name.includes('wav')) {
                    console.log('key is ' + name);
                    var url = s3.getSignedUrl('getObject', {
                        Bucket: data.Name,
                        Key: name
                    });
                    // soundsMap[i] = [name,url];
                    // soundsMap[i].push()
                    soundsArray.push(url);
                }
            }
        }
        console.log('\n sounds are '+soundsArray);
        // return res.send(urls);
        res.render('index', {sounds: soundsArray});
    });
});

app.listen(port, function () {
    console.log('App running on ' + port + ' port.');
});
