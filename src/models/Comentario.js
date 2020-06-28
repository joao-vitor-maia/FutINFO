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
        max:700,
        required:true
    },
    data: {
        type:Date,
        default:new Date()
    }
});

module.exports = mongoose.model("Comentario",comentario);