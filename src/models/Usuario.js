const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt")

const Usuario = new Schema({
    nome: {
        type:String,
        unique:true,
        min:2,
        max:60,
        required:true
    },
    email: {
        type:String,
        unique:true,
        min:12,
        max:60,
        required:true
    },
    senha: {
        type:String,
        min:8,
        max:30,
        required:true
    },
    horario: {
        type:mongoose.Types.ObjectId,
        ref:"horarios"
    },
    date: {
        type:Date,
        default:new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"}),
        required:true
    },
    admin: {
        type:Boolean,
        default:false,
        required:true
    }
});

module.exports = mongoose.model("usuarios",Usuario);