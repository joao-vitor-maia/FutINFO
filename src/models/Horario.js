const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    horarioInicial: {
        type:Date,
        required:true
    },
    horarioFinal: {
        type:Date,
        required:true
    },
    dia: {
        type:Date,
        required:true
    },
    data: {
        type:Date,
        default:new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"})
    }
});

module.exports = mongoose.model("Horario",horario);