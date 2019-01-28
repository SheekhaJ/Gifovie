const express = require('express');
var giphy = require('giphy-api')();
const app = express();

app.set('view engine', 'ejs');

app.get('/', function(req, res){
    res.render('index');
});

giphy.search('crazy', function(err, res){
    
})

app.listen(3000, function(){
    console.log('App running on 3000 port.')
});