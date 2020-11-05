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

        //Validação
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
exports.redefinirSenha = async(req,res) => {
    try{                
        const email = req.body.email;
        const senhaNova = req.body.senhaNova;
        const senhaReserva = req.body.senhaReserva;
        
        const usuario = await Usuario.findOne({email:email});

        //Validação
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
        return res.json({message:"error"});
   }
    
};
exports.editarNome = async(req,res) => {
    try{
        const token = req.headers["authorization"];

        const nome1 = req.body.nome1;
        const nome2 = req.body.nome2;
        
        //Validação
        if(validator.isLength(nome1,{min:2,max:60}) && sanitize(nome1,{allowedTags:[], allowedAttributes:{} }) == nome1 && 
        nome1 == nome2 ){
            //Verificação token
            jwt.verify(token,process.env.SECRETKEY, async (error,decoded) => {
                if(error){
                    return res.json({message:"unauthorized"});
                }else{
                    const usuario = await Usuario.findOne({email:decoded.email});
                    usuario.nome = nome1;
                    await usuario.save();

                    res.clearCookie("token");                    
                    return res.json({message:"sucess"});
                };
            });
        }else{
            return res.json({message:"invalid"});
        };
   }catch(err){
        return res.json({message:"error"});
   }
    
};
exports.editarEmail = async(req,res) => {
    try{
        const token = req.headers["authorization"];

        const email1 = req.body.email1;
        const email2 = req.body.email2;
        
        //Validação
        if(validator.isLength(email1,{min:2,max:60}) && sanitize(email1,{allowedTags:[], allowedAttributes:{} }) == email1 && 
        email1 == email2 ){
            //Verificação token
            jwt.verify(token,process.env.SECRETKEY, async (error,decoded) => {
                if(error){
                    return res.json({message:"unauthorized"});
                }else{
                    const usuario = await Usuario.findOne({email:decoded.email});
                    usuario.email = email1;
                    await usuario.save();
                    
                    res.clearCookie("token");
                    return res.json({message:"sucess"});
                };
            });
        }else{
            return res.json({message:"invalid"});
        };
   }catch(err){
        return res.json({message:"error"});
   };
    
};
exports.editarSenha = async(req,res) => {
    try{
        const token = req.headers["authorization"];
        const senhaAtual = req.body.senhaAtual;
        const senha1 = req.body.senha1;
        const senha2 = req.body.senha2;
        
        //Verificação token
        jwt.verify(token,process.env.SECRETKEY, async (error,decoded) => {
            if(error) {
                return res.json({message:"unauthorized"});
            }else{
                //Busco usuario e verifico se senha input é igual senha do usuario
                const usuario = await Usuario.findOne({email:decoded.email});
                const senhaIsValid = await bcrypt.compare(senhaAtual,usuario.senha);

                if(senha1 == senha2 && senhaIsValid == true){

                    const senhaHash = await new Promise((resolve, reject) => {
                        bcrypt.hash(senha1, 10, function(err, hash) {
                            if(err) {
                              reject(err)
                            }else{
                              resolve(hash)
                            };
                        });  
                    });
                    usuario.senha = senhaHash;
                    await usuario.save();

                    res.clearCookie("token");
                    return res.json({message:"sucess"});
                }else{
                    return res.json({message:"invalid"});
                };
            };
        });
   }catch(err){
        return res.json({message:"error"});
   };
    
};
exports.editarTelefone = async(req,res) => {
    try{
        const token = req.headers["authorization"];

        const telefone1 = req.body.telefone1;
        const telefone2 = req.body.telefone2;
        
        //Validação
        if(validator.isLength(telefone1,{min:8,max:60}) && sanitize(telefone1,{allowedTags:[], allowedAttributes:{} }) == telefone1 && 
        telefone1 == telefone2 ){
            //Verificação token
            jwt.verify(token,process.env.SECRETKEY, async (error,decoded) => {
                if(error){
                    return res.json({message:"unauthorized"});
                }else{
                    const usuario = await Usuario.findOne({_id:decoded.id});
                    usuario.telefone = telefone1;
                    await usuario.save();
                    
                    res.clearCookie("token");
                    return res.json({message:"sucess"});
                };
            });
        }else{
            return res.json({message:"invalid"});
        };
   }catch(err){
        return res.json({message:"error"});
   };
};
exports.adicionarAfiliado = async(req,res) => {
    try{
        const token = req.headers["authorization"];
        
        const nome = req.body.nome;
        const email = req.body.email;
        const Senha = req.body.senha;
        const SenhaReserva = req.body.senhaReserva;

        const usuarioComEmailIgual = await Usuario.find({email:email});

        //Validando dados do Usuário e salvando no banco
        if(Object.entries(usuarioComEmailIgual).length > 0){
            return res.json({message:"users equal"});

        //Validação
        }else if(validator.isLength(nome,{min:2,max:60}) && sanitize(nome,{allowedTags:[], allowedAttributes:{} }) == nome &&
        validator.isEmail(email) && sanitize(email,{allowedTags:[], allowedAttributes:{} }) == email && validator.isLength(email,{min:11,max:60}) &&
        validator.isLength(Senha,{min:8,max:30}) &&
        validator.isLength(SenhaReserva,{min:2,max:60}) ){
            //Verificação token
            jwt.verify(token,process.env.SECRETKEY, async (error,decoded) => {
                if(error || decoded.admin == false){
                    return res.json({message:"unauthorized"});
                }else{
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
                        senhaReserva:senhaReserva,
                        afiliado:true
                    };
        
                    await new Usuario(dados).save();            
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