'use strict';

const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../../config');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const User = require('../models/user');

router.post('/sign-up', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
  res.setHeader('Access-Control-Allow-Credentials', true); // If needed

  User.findOne({ email: req.body.email }, (err, user) => {
    try{
      if (err) return res.status(500).send({ mensagem: 'Ocorreu um erro inesperado no servidor.' });
      if (!user) {
        const psw = bcrypt.hashSync(req.body.senha, 10);
        // eslint-disable-next-line no-underscore-dangle
        const token = jwt.sign({ id: User._id }, config.secret, {
          expiresIn: config.expiresIn,
        });
  
        const newUser = new User({
          nome: req.body.nome,
          email: req.body.email,
          imagem: req.body.imagem,
          senha: psw,
          telefones: req.body.telefones,
          token: token,
        });
  
        newUser.save((error) => {
          if (error) return res.status(500).send({ mensagem: 'Erro ao cadastrar usuário' });
        });
        return res.status(200).send({
          id: newUser.id,
          data_criacao: newUser.createAt,
          data_atualizacao: newUser.updateAt,
          ultimo_login: newUser.loginDate,
          token: token,
        });
      }
      res.status(400).send({ mensagem: 'E-mail já existente' });
    }
    catch(error){
      res.status(500).send({ mensagem: 'Ocorreu um erro inesperado no servidor'}); 
    }
  });
});

router.post('/sign-in', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
  res.setHeader('Access-Control-Allow-Credentials', true); // If needed

  User.findOne({ email: req.body.email }, (err, user) => {
    try{
      if (err) return res.status(500).send({ mensagem: 'Ocorreu um erro inesperado no servidor.' });
      if (!user) return res.status(404).send({ mensagem: 'Usuário e/ou senha inválidos' });

      const passwordIsValid = bcrypt.compareSync(req.body.senha, user.senha);

      if (!passwordIsValid) return res.status(401).send({ mensagem: 'Usuário e/ou senha inválidos' });
      // eslint-disable-next-line no-underscore-dangle
      const token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: config.expiresIn,
      });

      User.update({ _id: user.id }, {
        $set: {
          loginDate: new Date(),
          token: token,
        },
      }, (error) => {
        if (error) {
          res.status(500).send({ mensagem: `Erro ao tentar atualizar o usuario!${error}` });
        } else {
          res.status(200).send({
            id: user.id,
            data_criacao: user.createAt,
            data_atualizacao: user.updateAt,
            ultimo_login: user.loginDate,
            token: token,
          });
        }
      });
    }
    catch(error){
      res.status(500).send({ mensagem: 'Ocorreu um erro inesperado no servidor'}); 
    }
  });
});

module.exports = router;
