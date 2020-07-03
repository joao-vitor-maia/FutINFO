const usuarios = require("@models/Usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.gerarToken = async (req,res) => {
   try{        
        const email = req.body.email;
        const senha = req.body.senha;

        const usuario = await usuarios.findOne({email:email});
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
        const token = req.body.token;
    
    jwt.verify(token,process.env.SECRETKEY, (error,decoded) => {
        if(error){
            return res.json({message:"unauthorized"});
        }else{
            console.log(decoded.id)
            next();
        };
    });
    }catch(err){
        return res.json({message:"error"});
    };
};