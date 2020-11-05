
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//O campo "modalidade" pode ser "Campo" ou "Futsal"
//O campo "categoria" pode ser "Masculino" ou "Feminino"
const artilheiro = Schema({
    modalidade: {
        type:String,
        required:true
    },
    categoria: {
        type:String,
        required:true
    },
    divisao: {
        type:Number,
        min:1,
        required:true
    },
    timeId: {
        type:Schema.Types.ObjectId,
        ref:"Time",
        required:true   
    },
    nome: {
        type:String,
        min:2,
        max:60,
        required:true
    },
    gol: {
        type:Number,
        required:true
    },
    data: {
        type:Date,
        default:new Date()
    },
    dataTimestamp: {
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model("Artilheiro",artilheiro);