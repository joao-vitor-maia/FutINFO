const Artilheiro = require("@models/Artilheiro");
const Time = require("@models/Time");
const jwt = require("jsonwebtoken");
const validator = require("validator");

exports.registrarArtilheiro = async (req,res) => {
    try{
        const token = req.headers["authorization"];
        const modalidade = req.body.modalidade;
        const categoria = req.body.categoria;
        const divisao = req.body.divisao;
        const nomeArtilheiro = req.body.nomeArtilheiro;
        const nomeTime = req.body.nomeTime;
        const gol = req.body.gol;

        //Buscando time
        const time = await Time.findOne({nome:nomeTime});

        if((modalidade == "Futebol" || modalidade == "Futsal") &&
        (categoria == "Masculino" || categoria == "Feminino") &&
        validator.isInt(divisao) &&
        time &&
        validator.isLength(nomeArtilheiro,{min:2,max:60}) && 
        validator.isInt(gol) ) {

            jwt.verify(token,process.env.SECRETKEY, async (error,decoded) => {
                if(error || decoded.admin == false){
                    return res.json({message:"unauthorized"});
                }else{
                    const dados = {
                        modalidade:modalidade,
                        categoria:categoria,
                        divisao:divisao,
                        nome:nomeArtilheiro,
                        timeId:time._id,
                        divisao:divisao,
                        gol:gol
                    };
                    await Artilheiro(dados).save();

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