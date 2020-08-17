const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imagemQuadra = new Schema({
    quadraId: {
        type:Schema.Types.ObjectId,
        ref:"Quadra",
        required:true
    },
    localizacao: {
        type:String,
        required:true
    },
    data: {
        type:Date,
        default:new Date()
    }
});

module.exports = mongoose.model("ImagemQuadra",imagemQuadra);