const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Url será chamada ao levar a imagem pro front no handlebars
//Diretório será chamado ao deletar imagem
const imagemNoticia = new Schema({
    noticiaId: {
        type:Schema.Types.ObjectId,
        ref:"Noticia",
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

module.exports = mongoose.model("ImagemNoticia",imagemNoticia);