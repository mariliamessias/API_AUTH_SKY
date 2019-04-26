'use strict';

const jwt = require('jsonwebtoken');
const config = require('../../config');
const User = require('../models/user');

const naoValidarToken = function (req) {
  return req.originalUrl === '/api/auth/sign-in' || req.originalUrl === '/api/auth/sign-up';
};
function verifyToken(req, res, next) {

  if (naoValidarToken(req)) { return next(); }

  let token = req.headers.authorization;
  if (!token) { return res.status(403).send({ mensagem: 'Não autorizado' }); }

  if (token.startsWith('Bearer ')) token = token.slice(7, token.length);
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) { return res.status(403).send({ mensagem: 'Não autorizado' }); }

    User.findOne({ _id: decoded.id }, (erro, user) => {
      if (user && user.token === token) {
        req.userId = decoded.id;
        next();
      } else return res.status(403).send({ mensagem: 'Não autorizado' });
    });
  });
}
module.exports = verifyToken;
