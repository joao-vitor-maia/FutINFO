const Usuario = require("@models/Usuario");
const validator = require("validator");
const bcrypt = require("bcrypt");
const sanitize = require("sanitize-html");
const jwt = require("jsonwebtoken");

exports.cadastrar = async(req,res) => {
    try{
        const nome = req.body.nome;
        const email = req.body.email;
        const Senha = req.body.senha;
        const SenhaReserva = req.body.senhaReserva;

        const usuarioComEmailIgual = await Usuario.find({email:email});

        //Validando dados do Usuário e salvando no banco
        if(Object.entries(usuarioComEmailIgual).length > 0){
            return res.json({message:"users equal"});

        }else if(validator.isLength(nome,{min:2,max:60}) && sanitize(nome,{allowedTags:[], allowedAttributes:{} }) == nome &&
        validator.isEmail(email) && sanitize(email,{allowedTags:[], allowedAttributes:{} }) == email && validator.isLength(email,{min:11,max:60}) &&
        validator.isLength(Senha,{min:8,max:30}) &&
        validator.isLength(SenhaReserva,{min:2,max:60}) ){
            const senha = await new Promise((resolve, reject) => {
                bcrypt.hash(Senha, 10, function(err, hash) {
                    if(err) {
                      reject(err)
                    }else{
                      resolve(hash)
                    };
                });  
            });
            const senhaReserva = await new Promise((resolve, reject) => {
                bcrypt.hash(SenhaReserva, 10, function(err, hash) {
                    if(err) {
                      reject(err)
                    }else{
                      resolve(hash)
                    };
                });  
            });

            const dados = {
                nome:nome,
                email:email,
                senha:senha,
                senhaReserva:senhaReserva
            };

            await new Usuario(dados).save();            
            return res.json({message:"success"});
        }else{
            return res.json({message:"invalid"});
        };

    }catch(err){
        return res.json({message:"error"});
    };
};
exports.editar = async(req,res) => {
    try{        
        
        const email = req.body.email;
        const senhaNova = req.body.senhaNova;
        const senhaReserva = req.body.senhaReserva;
        
        const usuario = await Usuario.findOne({email:email});
        
        if(usuario == null) { 
            return res.json({message:"not found"}) 
        }else{   
            const senhaIsValid = await bcrypt.compare(senhaReserva,usuario.senhaReserva);

            if(senhaIsValid == false){
                return res.json({message:"incorrect password"});    
            }else if(!validator.isLength(senhaNova,{min:8,max:30})){
                return res.json({message:"invalid"});
            }else{
                
                const senha = await new Promise((resolve, reject) => {
                    bcrypt.hash(senhaNova, 10, function(err, hash) {
                        if(err) {
                          reject(err)
                        }else{
                          resolve(hash)
                        };
                    });  
                });
                usuario.senha = senha;
                await usuario.save();
                return res.json({message:"success"});
            };
        };

   }catch(err){
        res.json({message:"error"});
   }
    
};