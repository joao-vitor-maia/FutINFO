const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resultadoJogo = new Schema({
    modalidade: {
        type:String,
        required:true
    },
    categoria: {
        type:String,
        required:true
    },
    divisao: {
        type:Number,
        required:true
    },
    timeId1: {
        type:Schema.Types.ObjectId,
        ref:"Time",
        required:true
    },
    timeId2: {
        type:Schema.Types.ObjectId,
        ref:"Time",
        required:true
    },
    golTime1: {
        type:Number,
        required:true
    },
    golTime2: {
        type:Number,
        required:true
    },
    rodada: {
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

module.exports = mongoose.model("ResultadoJogo",resultadoJogo);