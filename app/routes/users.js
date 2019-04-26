var express = require('express');
var User = require('../models/user');
var router = express.Router();

router.route('/user/id/:id')
    .get(function(req, res){
        var id = req.params.id;
        var idUser = req.userId;
        User.findById(idUser, function(error, user){
            if(error){
                res.status(500).send({mensagem:'usuario nao localizado'});
            }
            else{
                if(user){
                    let sessionHour = new Date();
                    let lastLogin = user.loginDate;
                    let result = sessionHour - lastLogin;

                    var diffMins = Math.round(result / 60000); // minutes

                    if(diffMins < 30){
                        User.findById(id, function(err, user){
                            if(err){
                                res.status(500).send({mensagem:'ocorreu um erro inesperado no servidor'});
                            }
                            else{
                                if(user){
                                    res.json({
                                        id: user.id,
                                        data_criacao: user.createAt,
                                        data_atualizacao: user.updateAt,
                                        ultimo_login: user.loginDate,
                                        token: token,
                                    });
                                }
                                else{
                                    res.status(404).json({ mensagem:'usuario não localizado' });
                                }
                            }

                        })
                    }
                    else {
                        res.status(400).json({ mensagem:'sessão inválida'});
                    }
                }
                else{
                    res.status(404).json({ mensagem:'usuario não localizado' });
                }
            }
        });
    })
   
module.exports = router;