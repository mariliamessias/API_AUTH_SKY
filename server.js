'use strict';

const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authentication = require('./app/security/authentication');
const verifyToken = require('./app/security/verifyToken');
const users = require('./app/routes/users');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = Number(process.env.PORT || 3000);
const router = express.Router();

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  // res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

router.use(verifyToken, (req, res, next) => {
  next();
});

router.get('/', (req, res) => {
  res.json({ mensagem: 'Conectado' });
});

router.use(users);

router.use('/auth/', authentication);

app.use('/api', router);

mongoose.connect('mongodb://user:user123@ds121543.mlab.com:21543/skydesafio', { useNewUrlParser: true });

app.listen(port);

module.exports = app;
