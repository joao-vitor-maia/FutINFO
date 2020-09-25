const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const artilheiro = Schema({
    divisao: {
        type:Number,
        min:1,
        required:true
    },
    timeId: {
        type:Schema.Types.ObjectId,
        ref:"Time",
        required:true   
    },
    nome: {
        type:String,
        min:2,
        max:60,
        required:true
    },
    gol: {
        type:Number,
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

module.exports = mongoose.model("Artilheiro",artilheiro);