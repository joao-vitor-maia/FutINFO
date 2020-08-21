const Usuario = require("@models/Usuario");
const Quadra = require("@models/Quadra");
const ImagemQuadra = require("@models/ImagemQuadra");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.gerarToken = async (req,res) => {
   try{        
        const email = req.body.email;
        const senha = req.body.senha;

        const usuario = await Usuario.findOne({email:email});
        if(usuario == null) {
            return res.json({message:"not found"})
        }else{
            const senhaIsValid = await bcrypt.compare(senha,usuario.senha);
            
            if(senhaIsValid == false){
                return res.json({message:"incorrect password"});
            }else{
                const token = jwt.sign({
                    id:usuario._id,
                    nome:usuario.nome,
                    email:usuario.email,
                    afiliado:usuario.afiliado,
                    admin:usuario.admin
                },process.env.SECRETKEY,{expiresIn:"10h"});
                
                return res.json({message:token});
            };
        };

   }catch(err){
        res.json({message:"error"});
   }
};
exports.autorizarUsuario = async (req,res,next) => {
    try{
        const token = req.headers["authorization"];
    
        jwt.verify(token,process.env.SECRETKEY, (error,decoded) => {
            if(error){
                return res.json({message:"unauthorized"});
            }else{
                return res.json({message:"authorized"});
            };
        });
    }catch(err){
        return res.json({message:"error"});
    };
};
exports.autenticarAdicionarImagens = async (req,res,next) => {
    try{
        const token = req.headers["authorization"];

        if(token == undefined || token == "null"){
            return res.json({message:"unauthorized"});
        };

        jwt.verify(token,process.env.SECRETKEY,async (error,decoded) => {
            if(error || decoded.afiliado != true){
                return res.json({message:"unauthorized"});
            }else{
                const quadra = await Quadra.findOne({usuarioId:decoded.id}).sort({data:-1});
                
                if(!quadra){
                    return res.json({message:"quadra empty"});
                };
                next();
            };
        });
        
    }catch(err){
        return res.json({message:"error"});
    };
};
