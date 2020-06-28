const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imagemQuadra = new Schema({
    quadraId: {
        type:Schema.Types.ObjectId,
        ref:"Quadra",
        required:true
    },
    nome: {
        type:String,
        min:2,
        max:60,
        required:true
    },
    imagemBase64: {
        type:String,
        required:true
    },
    data: {
        type:Date,
        default:new Date()
    }
});

module.exports = mongoose.model("ImagemQuadra",imagemQuadra);