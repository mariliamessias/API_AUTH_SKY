var express = require('express');
var User = require('../models/user');
var router = express.Router();

router.route('/user/id/:id')
    .get(function(req, res){
        var id = req.params.id;
        User.findById(id, function(error, user){
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
                        res.json(user);
                    }else {
                        res.status(400).json({ mensagem:'sessão inválida!'});
                    }
                }
                else{
                    res.status(404).json({ mensagem:'usuario não encontrado!' });
                }
            }
        });
    })
   
module.exports = router;