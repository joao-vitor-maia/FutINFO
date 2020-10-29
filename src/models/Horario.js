const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Horário pode ser criado por Afiliado ou Usuário
//Horário disponível(Afiliado): possuirá campo "aprovado" igual a null, o campo "solicitado" será igual a false e não possuirá
// campo modalidade

//Horário solicitado(Usuário): campo "aprovado" poderá ser pendente, aprovado ou recusado isso será de acordo com a resposta
// do afiliado, terá campo solicitado igual a true e modalidade de acordo com as opções da quadra

const horario = new Schema({
    usuarioId: {
        type:Schema.Types.ObjectId,
        ref:"Usuario",
        required:true
    },
    quadraId: {
        type:Schema.Types.ObjectId,
        ref:"Quadra",
        required:true
    },
    ano: {
        type:String,
        required:true
    },
    mes: {
        type:String,
        required:true
    },
    dia: {
        type:String,
        required:true
    },
    solicitado: {
        type:Boolean,
        required:true
    },
    aprovado: {
        type:String,
        default:"pendente"
    },
    horarioIntervalo: {
        type:Object,
        required:true
    },
    modalidade: {
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

module.exports = mongoose.model("Horario",horario);