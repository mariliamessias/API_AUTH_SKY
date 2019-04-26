var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../../config');
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());
var User = require ('../models/user');

router.post('/sign-up', function(req, res){
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return res.status(500).send({mensagem:'Ocorreu um erro inesperado no servidor.'});
    if (!user) {
      var psw = bcrypt.hashSync(req.body.senha,10);
      var newUser = new User({
        nome: req.body.nome,
        email : req.body.email,
        senha : psw,
        telefones : req.body.telefones,
      });

      newUser.save(function(err){
        if(err) return res.status(500).send({mensagem:'Erro ao cadastrar usuário'});
        
      })
      var token = jwt.sign({id: User._id},config.secret, {
        expiresIn: config.expiresIn
       });

      return res.status(200).send({
          id: newUser.id,
          data_criacao: newUser.createAt,
          data_atualizacao: newUser.updateAt,
          ultimo_login: newUser.loginDate,
          token: token,
      });
  }
    res.status(400).send({mensagem:'E-mail já existente'});
    });
})



router.post('/sign-in', function(req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return res.status(500).send({mensagem:'Ocorreu um erro inesperado no servidor.'});
    if (!user) return res.status(404).send({mensagem:'Usuário e/ou senha inválidos'});
  
    var passwordIsValid = bcrypt.compareSync(req.body.senha, user.senha);

    if (!passwordIsValid) return res.status(401).send({mensagem:'Usuário e/ou senha inválidos'});

    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: config.expiresIn 
    });

    User.update({ _id: user.id }, { $set: { 
            loginDate: new Date(),
        } },function(error){
        if(error){                
            res.status(500).send({mensagem:'Erro ao tentar atualizar o usuario!' + error});
        }
        else{
          res.status(200).send({ 
          id: user.id,
          data_criacao: user.createAt,
          data_atualizacao: user.updateAt,
          ultimo_login: user.loginDate,
          token: token,
          });
        }
    });
  });
});

module.exports = router;