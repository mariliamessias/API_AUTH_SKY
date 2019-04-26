var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var authentication = require('./app/security/authentication');
var verifyToken = require('./app/security/verifyToken');
var users = require('./app/routes/users');
 
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = Number(process.env.PORT || 3000);
var router = express.Router();

router.use(verifyToken, function(req, res, next){
    next();
});

router.get('/', function(req, res){
    res.json({message: 'Conectado'});
});

router.use(users);

router.use('/auth/', authentication);
    
app.use('/api', router);

mongoose.connect('mongodb://user:user123@ds121543.mlab.com:21543/skydesafio',{ useNewUrlParser: true })

app.listen(port);

module.exports = app;