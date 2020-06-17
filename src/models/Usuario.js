const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usuario = new Schema({
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
    horarioId: {
        type:Schema.Types.ObjectId,
        ref:"horario"
    },
    quadraId: {
        type:Schema.Types.ObjectId,
        ref:"quadra"
    },
    data: {
        type:Date,
        default:new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"}),
        required:true
    },
    admin: {
        type:Boolean,
        default:false,
    },
    afiliado:{
        type:Boolean,
        default:false
    }
});

module.exports = mongoose.model("Usuario",usuario);