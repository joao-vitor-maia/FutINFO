const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noticia = new Schema({
    manchete: {
        type:String,
        min:2,
        max:60,
        required:true
    },
    conteudo: {
        type:String,
        min:2,
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

module.exports = mongoose.model("Noticia",noticia);