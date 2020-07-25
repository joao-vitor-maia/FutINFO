const Time = require("@models/Time");
const jwt = require("jsonwebtoken");
const validator = require("validator");

exports.registrarTime = async (req,res) => {
    try{
        const token = req.body.token;
        const divisao = req.body.divisao;
        const classificacao = req.body.classificacao; 
        const nome = req.body.nome;
        const ponto = req.body.ponto;
        const jogo = req.body.jogo;
        const vitoria = req.body.vitoria;
        const derrota = req.body.derrota;

        if(validator.isLength(nome,{min:2,max:60}) && 
        validator.isInt(divisao) &&
        validator.isInt(classificacao) &&
        validator.isInt(ponto) &&
        validator.isInt(jogo) &&
        validator.isInt(vitoria) &&
        validator.isInt(derrota)){

            jwt.verify(token,process.env.SECRETKEY, async (error,decoded) => {
                if(error || decoded.admin == false){
                    return res.json({message:"unauthorized"});
                }else{
                    const dados = {
                        divisao:divisao,
                        nome:nome,
                        ponto:ponto,
                        jogo:jogo,
                        vitoria:vitoria,
                        derrota:derrota,
                        classificacao:classificacao
                    };
                    await Time(dados).save();

                    return res.json({message:"success"});
                };
            });

        }else{
            return res.json({message:"invalid"});
        };
    }catch(err){
        console.log(err)
        return res.json({message:"error"});
    };
};