const Comentario = require("@models/Comentario");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const sanitize = require("sanitize-html");

exports.comentar = async(req,res) => {
    try{
        const conteudo = req.body.comentario;
        if(validator.isLength(conteudo,{min:2,max:700}) && sanitize(conteudo,{allowedTags:[], allowedAttributes:{} }) == conteudo){
            const token = req.body.token;
            jwt.verify(token,process.env.SECRETKEY, async (error,decoded) => {
                if(error){
                    return res.json({message:"unauthorized"});
                }else{
                    const dados = {
                        usuarioId:decoded.id,
                        conteudo:conteudo 
                    };
                    await new Comentario(dados).save();
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