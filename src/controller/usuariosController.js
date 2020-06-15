const Usuario = require("@models/Usuario");
const validator = require("validator");
const bcrypt = require("bcrypt");
const sanitize = require("sanitize-html");

exports.cadastrar = async(req,res) => {
    try{
        const nome = req.body.nome;
        const email = req.body.email;
        const Senha = req.body.senha;

        //Validando dados do Usuário e salvando no banco
        if(validator.isLength(nome,{min:2,max:60}) && sanitize(nome,{allowedTags:[], allowedAttributes:{} }) == nome &&
        validator.isEmail(email) && sanitize(email,{allowedTags:[], allowedAttributes:{} }) == email && validator.isLength(email,{min:11,max:60}) &&
        validator.isLength(Senha,{min:8,max:30})
        ){
            const senha = await new Promise((resolve, reject) => {
                bcrypt.hash(Senha, 10, function(err, hash) {
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
                senha:senha
            };
            await new Usuario(dados).save();
            return res.json({resultado:"sucesso"});
        }else{
            return res.json({resultado:"invalidado"});
        };

    }catch(err){
        console.log(err);
        return res.json({resultado:"erro"});
    };
};