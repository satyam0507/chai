'use strict';

var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');
var bodyParser = require('body-parser');
var admin = require('./app/admin');

var app = express();
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5555));


app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('view engine', 'hbs');


app.use('/static', express.static('static'));



app.get('/', function (req, res) {
    res.render('home',{
        home:true
    });
});

app.get('/admin', function (req, res) {
    res.render('admin',{
        admin:true
    });
});

app.listen(app.get('port'), function () {
    console.log('app at port:- ' + app.get('port'));
});