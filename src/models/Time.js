const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const time = Schema({
    divisao: {
        type:Number,
        min:1,
        max:4,
        required:true
    },
    nome: {
        type:String,
        min:2,
        max:60,
        required:true
    },
    ponto: {
        type:Number,
        required:true
    },
    jogo: {
        type:Number,
        required:true
    },
    vitoria: {
        type:Number,
        required:true
    },
    derrota: {
        type:Number,
        required:true
    }   
});

module.exports = mongoose.model("Time",time);