var jwt = require('jsonwebtoken');
var config = require('../../config');
 
var naoValidarToken = function(req){
  return req.originalUrl === '/api/auth/sign-in' || req.originalUrl === '/api/auth/sign-up';
}
function verifyToken(req, res, next) {
 
  if(naoValidarToken(req))
    return next();
 
  let token = req.headers['authorization'];
  if (!token)
    return res.status(403).send({ mensagem: 'Não autorizado' });
  
  if (token.startsWith('Bearer ')) token = token.slice(7,token.length);
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err)
    return res.status(403).send({mensagem: 'Não autorizado' });
    req.userId = decoded.id;
    next();
  });
}
module.exports = verifyToken;