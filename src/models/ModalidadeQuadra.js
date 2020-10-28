const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const modalidadeQuadra = new Schema({
    quadraId: {
        type:Schema.Types.ObjectId,
        ref:"Quadra",
        required:true
    },
    modalidade1: {
        type:String,
        max:60
    },
    modalidade2: {
        type:String,
        max:60
    },
    modalidade3: {
        type:String,
        max:60
    },
    modalidade4: {
        type:String,
        max:60
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

module.exports = mongoose.model("ModalidadeQuadra",modalidadeQuadra);