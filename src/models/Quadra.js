const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const quadra = new Schema({
    usuarioId: {
        type:Schema.Types.ObjectId,
        ref:"Usuario",
        required:true
    },
    nome: {
        type:String,
        unique:true,
        min:2,
        max:60,
        required:true
    },
    rua: {
        type:String,
        min:2,
        max:60,
        required:true
    },
    bairro: {
        type:String,
        min:2,
        max:60,
        required:true
    },
    cep: {
        type:String,
        min:8,
        max:9,
        required:true
    },
    data: {
        type:Date,
        default:new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"})
    }
});

module.exports = mongoose.model("Quadra",quadra);