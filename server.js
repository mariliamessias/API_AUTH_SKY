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
