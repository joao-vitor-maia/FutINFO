const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const horario = new Schema({
    usuarioId: {
        type:Schema.Types.ObjectId,
        ref:"usuarios",
        required:true
    },
    quadraId: {
        type:Schema.Types.ObjectId,
        ref:"quadras",
        required:"true"
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
    }
});

module.exports = mongoose.model("Horario",horario);