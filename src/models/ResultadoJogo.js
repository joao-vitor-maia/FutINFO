const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resultadoJogo = new Schema({
    timeId1: {
        type:Schema.Types.ObjectId,
        ref:"Usuario",
        required:true
    },
    timeId2: {
        type:Schema.Types.ObjectId,
        ref:"Usuario",
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