const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const comentario = new Schema({
    usuarioId: {
        type:Schema.Types.ObjectId,
        ref:"Usuario",
        required:true
    },
    conteudo: {
        type:String,
        min:2,
        max:500,
        required:true
    },
    data: {
        type:Date,
        default:new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"})
    }
});

module.exports = mongoose.model("Comentario",comentario);