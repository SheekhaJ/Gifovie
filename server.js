const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
var port = 3000

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// app.use('cors');

var corsOptions = {
    origin: 'http://127.0.0.1',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.get('/', cors(corsOptions), function(req, res){
    res.render('index');
});

app.listen(port, function(){
    console.log('App running on '+port+' port.');
})
