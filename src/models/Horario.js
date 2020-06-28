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
    aprovado: {
        type:Boolean,
        default:false
    },
    horarioIntervalo: {
        type:Object,
        required:true
    },
    data: {
        type:Date,
        default:new Date()
    }
});

module.exports = mongoose.model("Horario",horario);