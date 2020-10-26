const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Campo "aprovado" pode ser pendente, aprovado ou recusado se for solicitado pelo usuário
//Se não for solicitado é porque vem do admin e terá o campo "aprovado" igual null
const horario = new Schema({
    usuarioId: {
        type:Schema.Types.ObjectId,
        ref:"Usuario",
        required:true
    },
    quadraId: {
        type:Schema.Types.ObjectId,
        ref:"Quadra",
        required:true
    },
    ano: {
        type:String,
        required:true
    },
    mes: {
        type:String,
        required:true
    },
    dia: {
        type:String,
        required:true
    },
    solicitado: {
        type:Boolean,
        required:true
    },
    aprovado: {
        type:String,
        default:"pendente"
    },
    horarioIntervalo: {
        type:Object,
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

module.exports = mongoose.model("Horario",horario);