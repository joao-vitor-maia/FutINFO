const jwt = require("jsonwebtoken");
const sanitize = require("sanitize-html");
const validator = require("validator");
const fs = require("fs");
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
                    const quadra = await Quadra.findOne({usuarioId:decoded.id}).sort({dataTimestamp:-1});

                    quadra.nome = nome;
                    quadra.rua = rua;
                    quadra.numeroRua = numeroRua;
                    quadra.cep = cep;
                    quadra.descricao = descricao;
                    await quadra.save();

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
        const token = req.headers["authorization"];
        const upload = req.files;

        jwt.verify(token,process.env.SECRETKEY, async (error,decoded) => {
            if(error || decoded.afiliado != true){
                return res.json({message:"unauthorized"});
            }else{
                const quadra = await Quadra.findOne({usuarioId:decoded.id}).sort({dataTimestamp:-1});
                const imagens = await ImagemQuadra.find({quadraId:quadra._id});

                //Verificando se ocorreu algum problema no fileFilter
                if(req.fileType){
                    for(const imagem of upload){
                        fs.unlinkSync(imagem.path);
                    };
                    return res.json({message:"invalid"});
                };
                //Verificar se a soma das imagens da quadra com as imagens do upload são iguais ou maiores que 7
                if((upload.length + imagens.length) > 7){
                    for(const imagem of upload){
                        fs.unlinkSync(imagem.path);
                    };
                    return res.json({message:"imagens limit"});
                };
                
                for(let imagem of upload){
                    const dados = {
                        quadraId:quadra._id,
                        url:"/uploads/"+imagem.filename,
                        diretorio:imagem.path
                    };
                    await new ImagemQuadra(dados).save();
                };
    
                return res.json({message:"success"});                
            };
        });
        
    }catch(error){
        return res.json({message:"error"});
    };
};
exports.deletarImagem = async (req,res) => {
    try{
        const token = req.headers["authorization"];
        const idImagem = req.body.idImagem;

        jwt.verify(token,process.env.SECRETKEY, async (error,decoded) => {
            if(error || decoded.afiliado != true){
                return res.json({message:"unauthorized"});
            }else{
                const imagem = await ImagemQuadra.findOne({_id:idImagem});
                fs.unlinkSync(imagem.diretorio);
                await imagem.deleteOne();
                return res.json({message:"sucess"});
                
            };
        });
    }catch(err){
        return res.json({message:"error"});
    }
};