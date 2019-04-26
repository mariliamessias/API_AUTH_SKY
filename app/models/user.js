var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var userSchema = new Schema({

    nome: String,
    email: String,
    senha: String,
    createAt : { type: Date, default: Date.now },
    updateAt : { type: Date, default: Date.now },
    loginDate: { type: Date, default: Date.now },
    token: String,
    telefones: [{
        numero: String,
        ddd: Number
        }
    ]     
});

module.exports = mongoose.model('User', userSchema);