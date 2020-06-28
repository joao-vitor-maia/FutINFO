const jwt = require("jsonwebtoken");
const sanitize = require("sanitize-html");
const validator = require("validator");
const Quadra = require("@models/Quadra");
const ImagemQuadra = require("@models/ImagemQuadra");

exports.salvarQuadra = async (req,res) => {
    try{
        const nome = req.body.nome; 
        const rua = req.body.rua; 
        const cep = req.body.cep; 
        const bairro = req.body.bairro; 
        const quadraComNomeIgual = await Quadra.find({nome:nome});

        const imagemBase64 = ["imagem1","imagem2"];
        
        //Validação
        if(validator.isLength(nome,{min:2,max:60}) && sanitize(nome,{allowedTags:[], allowedAttributes:{} }) == nome && Object.entries(quadraComNomeIgual).length == 0 &&
        validator.isLength(rua,{min:2,max:60}) && sanitize(rua,{allowedTags:[], allowedAttributes:{} }) == rua &&
        validator.isLength(cep,{min:8,max:9}) && sanitize(cep,{allowedTags:[], allowedAttributes:{} }) == cep && /[0-9]{5}-[0-9]{3}/.test(cep) &&
        validator.isLength(bairro,{min:2,max:60}) && sanitize(bairro,{allowedTags:[], allowedAttributes:{} }) == bairro ){
            
            const token = req.body.token;

            jwt.verify(token,process.env.SECRETKEY, async (error,decoded) => {
                if(error || decoded.afiliado != true){
                    return res.json({message:"unauthorized"});
                }else{
                    const dadosQuadra = {
                        nome:nome,
                        rua:rua,
                        cep:cep,
                        bairro:bairro,
                        usuarioId:decoded.id
                    };
                    const quadra = await new Quadra(dadosQuadra).save();


                    //Salvando cada imagem do array separadamente
                        for(let imagem of imagemBase64){
                            const dadosImagem = {
                                quadraId:quadra._id,
                                imagemBase64:imagem
                            };
                            await new ImagemQuadra(dadosImagem).save();
                            
                        };

                    return res.json({message:"success"});
                    
                };
            });
        }else{
            return res.json({message:"invalid"});
        };

    }catch(err){
        console.log(err)
        return res.json({message:"error"});
    }
};
exports.editarQuadra = async (req,res) => {
    try{
        const token = req.body.token;
        const nome = req.body.nome;
        const quadraComNomeIgual = await Quadra.find({nome:nome});

        if(validator.isLength(nome,{min:2,max:60}) && sanitize(nome,{allowedTags:[], allowedAttributes:{} }) == nome &&
        Object.entries(quadraComNomeIgual).length == 0 ){
            
            jwt.verify(token,process.env.SECRETKEY, async (error,decoded) => {
                if(error || decoded.afiliado != true){
                    return res.json({message:"unauthorized"});
                }else{
                    const quadra = await Quadra.findOne({usuarioId:decoded.id});
                    quadra.nome = nome;
                    await quadra.save();
        
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
exports.adicionarImagem = async (req,res) => {
    try{
        const token = req.body.token;
        const imagens = ["imagem1","imagem2"];

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