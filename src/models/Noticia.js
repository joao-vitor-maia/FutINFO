const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const fns = require("date-fns");

const noticia = new Schema({
    divisao: {
        type:Number,
        min:1,
        max:4,
        required:true
    },
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
        type:Object,
        default:{data:new Date()}
    }
});

module.exports = mongoose.model("Noticia",noticia);