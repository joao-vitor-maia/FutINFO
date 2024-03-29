const ResultadoJogo = require("@models/ResultadoJogo");
const Time = require("@models/Time");
const jwt = require("jsonwebtoken");
const validator = require("validator");

exports.adicionarResultadoJogo = async (req,res) => {
    try{
        const token = req.headers["authorization"];

        const modalidade = req.body.modalidade;
        const categoria = req.body.categoria;
        const divisao = req.body.divisao;
        const nomeTime1 = req.body.time1;
        const nomeTime2 = req.body.time2;
        const golTime1 = req.body.golTime1;
        const golTime2 = req.body.golTime2;
        const rodada = req.body.rodada;

        var time1 = await Time.findOne({nome:nomeTime1, modalidade: modalidade, categoria: categoria});
        var time2 = await Time.findOne({nome:nomeTime2, modalidade: modalidade, categoria: categoria});

        //Validação
        if(!time1 || !time2) {
            return res.json({message:"not found"});

        } else if ((modalidade == "Campo" || modalidade == "Futsal") &&
            (categoria == "Masculino" || categoria == "Feminino") &&
            validator.isInt(divisao) &&
            validator.isInt(golTime1) &&
            validator.isInt(golTime2) &&
            validator.isInt(rodada) ){

            //Verificação token
            jwt.verify(token,process.env.SECRETKEY, async (error,decoded) => {
                if(error || decoded.admin == false){
                    return res.json({message:"unauthorized"});
                }else{
                    const dados = {
                        modalidade:modalidade,
                        categoria:categoria,
                        divisao:divisao,
                        timeId1:time1._id,
                        timeId2:time2._id,
                        golTime1:golTime1,
                        golTime2:golTime2,
                        rodada:rodada
                    };
                    await new ResultadoJogo(dados).save();

                    return res.json({message:"success"});
                };
            });

        }else{
            return res.json({message:"invalid"});
        };
    }catch(err){
        return res.json({message:"error"});
    };
};

exports.editarResultadoJogo = async (req,res) => {
    try{
        const token = req.headers["authorization"];
        const resultadoJogoId = req.body.resultadoJogoId;
        const modalidade = req.body.modalidade;
        const categoria = req.body.categoria;
        const nomeTime1 = req.body.time1;
        const nomeTime2 = req.body.time2;
        const golTime1 = req.body.golTime1;
        const golTime2 = req.body.golTime2;

        var time1 = await Time.findOne({nome:nomeTime1, modalidade: modalidade, categoria: categoria});
        var time2 = await Time.findOne({nome:nomeTime2, modalidade: modalidade, categoria: categoria});

        //Validação
        if(!time1 || !time2) {
            return res.json({message:"not found"});

        } else if ((modalidade == "Campo" || modalidade == "Futsal") &&
        (categoria == "Masculino" || categoria == "Feminino") &&
        validator.isInt(golTime2) ){
        validator.isInt(golTime1) &&
            //Verificação token
            jwt.verify(token,process.env.SECRETKEY, async (error,decoded) => {
                if(error || decoded.admin == false){
                    return res.json({message:"unauthorized"});
                }else{
                    const resultadoJogo = await ResultadoJogo.findOne({_id:resultadoJogoId});
                    resultadoJogo.modalidade = modalidade;
                    resultadoJogo.categoria = categoria;
        
                    resultadoJogo.timeId1 = time1._id;
                    resultadoJogo.timeId2 = time2._id;
                    resultadoJogo.golTime1 = golTime1;
                    resultadoJogo.golTime2 = golTime2;
                    await resultadoJogo.save();

                    return res.json({message:"success"});
                };
            });

        }else{
            return res.json({message:"invalid"});
        };
    }catch(err){
        return res.json({message:"error"});
    };
};