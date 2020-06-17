const usuarios = require("@models/Usuario");
const bcrypt = require("bcrypt");

exports.generateToken = async (req,res) => {
   try{
        const jwt = require("jsonwebtoken");

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
                    email:usuario.email
                },process.env.SECRETKEY,{expiresIn:"3d"});
                
                return res.json({message:token});
            };
        };

   }catch(err){
        res.send({erro:err});
   }
}