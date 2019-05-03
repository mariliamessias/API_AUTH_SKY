'use strict';

const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.route('/user/id/:id')
  .get((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With , content-type, Authorization, other_header, Accept');
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true);

    const { id } = req.params;
    const idUser = req.userId;
    User.findById(idUser, (error, user) => {
      if (error) {
        res.status(500).send({ mensagem: 'usuario nao localizado' });
      } else if (user) {
        const sessionHour = new Date();
        const lastLogin = user.loginDate;
        const result = sessionHour - lastLogin;

        const diffMins = Math.round(result / 60000); // minutes

        if (diffMins < 30) {
          User.findById(id, (err, userValue) => {
            if (err) {
              res.status(500).send({ mensagem: 'ocorreu um erro inesperado no servidor' });
            } else if (userValue) {
              res.json({
                id: userValue.id,
                nome: userValue.nome,
                email: userValue.email,
                token: userValue.token,
              });
            } else {
              res.status(404).json({ mensagem: 'usuario não localizado' });
            }

          });
        } else {
          res.status(400).json({ mensagem: 'sessão inválida' });
        }
      } else {
        res.status(404).json({ mensagem: 'usuario não localizado' });
      }
    });
  });

module.exports = router;
