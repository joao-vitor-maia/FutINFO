const Noticia = require("@models/Noticia");
const validator = require("validator");
const sanitize = require("sanitize-html");
const jwt = require("jsonwebtoken");

exports.postarNoticia = async (req,res) => {
    const token = req.body.token;
    const manchete = req.body.manchete;
    const divisao = req.body.divisao;
    const conteudo = req.body.conteudo; 

    if(validator.isLength(manchete,{min:2,max:60}) &&
    validator.isInt(divisao) &&
    validator.isLength(conteudo,{min:2})){
        
        jwt.verify(token,process.env.SECRETKEY, async (error,decoded) => {
            if(error || decoded.admin == false){
                return res.json({message:"unauthorized"});
            }else{
                const dados = {
                    manchete:manchete,
                    divisao:divisao,
                    conteudo:conteudo
                };
                await Noticia(dados).save();
                return res.json({message:"success"});
            };
        });

    }else{
        return res.json({message:"invalid"});
    }
};