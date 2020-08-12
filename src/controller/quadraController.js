const jwt = require("jsonwebtoken");
const sanitize = require("sanitize-html");
const validator = require("validator");
const Quadra = require("@models/Quadra");
const ImagemQuadra = require("@models/ImagemQuadra");

exports.salvarQuadra = async (req,res) => {
    try{
        const nome = req.body.nome; 
        const descricao = req.body.descricao;
        const rua = req.body.rua; 
        const cep = req.body.cep; 
        const numeroRua = req.body.numeroRua;
        // const imagens = req.files;
        
        //Validação
        if(validator.isLength(nome,{min:2,max:60}) && sanitize(nome,{allowedTags:[], allowedAttributes:{} }) == nome && 
        validator.isLength(rua,{min:2,max:60}) && sanitize(rua,{allowedTags:[], allowedAttributes:{} }) == rua &&
        validator.isLength(cep,{min:8,max:9}) && sanitize(cep,{allowedTags:[], allowedAttributes:{} }) == cep && /[0-9]{5}-[0-9]{3}/.test(cep) &&
        validator.isLength(numeroRua,{min:1,max:5}) && sanitize(numeroRua,{allowedTags:[], allowedAttributes:{} }) == numeroRua && validator.isInt(numeroRua) 
        ) {
            const token = req.headers["authorization"];
            
            jwt.verify(token,process.env.SECRETKEY, async (error,decoded) => {
                if(error || decoded.afiliado != true){
                    return res.json({message:"unauthorized"});
                }else{
                    const dadosQuadra = {
                        nome:nome,
                        rua:rua,
                        numeroRua:numeroRua,
                        cep:cep,
                        descricao:descricao,
                        usuarioId:decoded.id
                    };
                    const quadra = await new Quadra(dadosQuadra).save();

                    // //Salvando cada imagem do array separadamente
                    //     for(let imagem of imagens){
                    //         const dadosImagem = {
                    //             quadraId:quadra._id,
                    //             imagemBase64:imagem
                    //         };
                    //         await new ImagemQuadra(dadosImagem).save();
                            
                    //     };

                    return res.json({message:"success"});
                    
                };
            });
        }else{
            return res.json({message:"invalid"});
        };
    }catch(err){
        return res.json({message:"error"});
    }
};
exports.editarQuadra = async (req,res) => {
    try{
        const nome = req.body.nome; 
        const descricao = req.body.descricao;
        const rua = req.body.rua; 
        const cep = req.body.cep; 
        const numeroRua = req.body.numeroRua;
        // const imagens = req.files;
        
        //Validação
        if(validator.isLength(nome,{min:2,max:60}) && sanitize(nome,{allowedTags:[], allowedAttributes:{} }) == nome && 
        validator.isLength(rua,{min:2,max:60}) && sanitize(rua,{allowedTags:[], allowedAttributes:{} }) == rua &&
        validator.isLength(cep,{min:8,max:9}) && sanitize(cep,{allowedTags:[], allowedAttributes:{} }) == cep && /[0-9]{5}-[0-9]{3}/.test(cep) &&
        validator.isLength(numeroRua,{min:1,max:5}) && sanitize(numeroRua,{allowedTags:[], allowedAttributes:{} }) == numeroRua && validator.isInt(numeroRua) 
        ) {
            const token = req.headers["authorization"];
            
            jwt.verify(token,process.env.SECRETKEY, async (error,decoded) => {
                if(error || decoded.afiliado != true){
                    return res.json({message:"unauthorized"});
                }else{
                    const quadra = await Quadra.findOne({usuarioId:decoded.id}).sort({data:-1});

                    quadra.nome = nome;
                    quadra.rua = rua;
                    quadra.numeroRua = numeroRua;
                    quadra.cep = cep;
                    quadra.descricao = descricao;
                    await quadra.save();
                    // //Salvando cada imagem do array separadamente
                    //     for(let imagem of imagens){
                    //         const dadosImagem = {
                    //             quadraId:quadra._id,
                    //             imagemBase64:imagem
                    //         };
                    //         await new ImagemQuadra(dadosImagem).save();
                            
                    //     };

                    return res.json({message:"success"});
                    
                };
            });
        }else{
            return res.json({message:"invalid"});
        };
    }catch(err){
        return res.json({message:"error"});
    }
};
exports.adicionarImagem = async (req,res) => {
    try{
        const token = req.body.token;
        const imagens = ["imagem1","imagem2","imagem3"];

        if(Object.entries(imagens).length == 0){
            return res.json({message:"invalid"});
        }else{
            jwt.verify(token,process.env.SECRETKEY, async (error,decoded) => {
                if(error || decoded.afiliado != true){
                    return res.json({message:"unauthorized"});
                }else{
                    const quadra = await Quadra.findOne({usuarioId:decoded.id});

                    for(let imagem of imagens){
                        const dados = {
                            quadraId:quadra._id,
                            imagemBase64:imagem
                        };
        
                        await ImagemQuadra(dados).save();
                    };
        
                    return res.json({message:"success"});
                    
                };
            });
        };
    }catch(error){
        return res.json({message:"error"});
    };
};
exports.deletarImagem = async (req,res) => {
    try{
        const token = req.body.token;
        const Imagem = req.body.imagem64;

        jwt.verify(token,process.env.SECRETKEY, async (error,decoded) => {
            if(error || decoded.afiliado != true){
                return res.json({message:"unauthorized"});
            }else{
                const quadra = await Quadra.findOne({usuarioId:decoded.id});
                const resultadoDelete = await ImagemQuadra.findOneAndDelete({imagemBase64:Imagem, quadraId:quadra});
                const resultado = resultadoDelete == null?"not found":"success";
                return res.json({message:resultado});
                
            };
        });
    }catch(err){
        return res.json({message:"error"});
    }
};