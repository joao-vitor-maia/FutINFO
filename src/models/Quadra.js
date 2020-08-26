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
    numeroRua: {
        type:Number,
        required:true
    },
    cep: {
        type:String,
        min:8,
        max:9,
        required:true
    },
    descricao: {
        type:String,
        max:500
    },
    data: {
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model("Quadra",quadra);