const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imagemQuadra = new Schema({
    quadraId: {
        type:Schema.Types.ObjectId,
        ref:"Quadra",
        required:true
    },
    url: {
        type:String,
        required:true
    },
    diretorio: {
        type:String,
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

module.exports = mongoose.model("ImagemQuadra",imagemQuadra);