const Noticia = require("@models/Noticia");
const validator = require("validator");
const fs = require("fs")
const ImagemNoticia = require("@models/ImagemNoticia");
const jwt = require("jsonwebtoken");

exports.postarNoticia = async (req,res) => {
    try{
        const token = req.headers["authorization"];

        const manchete = req.body.manchete;
        const conteudo = req.body.conteudo; 
        const imagem = req.file;

        //Verificando se ocorreu algum problema no fileFilter
        if(req.fileType){
            fs.unlinkSync(imagem.path);
            return res.json({message:"invalidType"});
        };

        //Validação
        if(validator.isLength(manchete,{min:2}) &&
        validator.isLength(conteudo,{min:2})){
            //Verificação token
            jwt.verify(token,process.env.SECRETKEY, async (error,decoded) => {
                if(error || decoded.admin == false){
                    fs.unlinkSync(imagem.path);
                    return res.json({message:"unauthorized"});
                }else{
                    const dadosNoticia = {
                        manchete:manchete,
                        conteudo:conteudo
                    };
                    const noticia = await new Noticia(dadosNoticia).save();

                    const dadosImagem = {
                        noticiaId:noticia._id,
                        url:"/uploads/"+imagem.filename,
                        diretorio:imagem.path
                    };
                    await new ImagemNoticia(dadosImagem).save();
                    return res.json({message:"success"});
                };
            });

        }else{
            fs.unlinkSync(imagem.path);
            return res.json({message:"invalid"});
        };
    }catch(err){
        return res.json({message:"error"});
    };
};
exports.editarNoticia = async (req,res) => {
    try{
        const token = req.headers["authorization"];

        const noticiaId = req.body.noticiaId;
        const manchete = req.body.manchete;
        const conteudo = req.body.conteudo; 
        const imagem = req.file;

        //Verificando se ocorreu algum problema no fileFilter
        if(req.fileType){
            fs.unlinkSync(imagem.path);
            return res.json({message:"invalidType"});
        };
        
        //Validação
        if(validator.isLength(manchete,{min:2}) &&
        validator.isLength(conteudo,{min:2})){
            //Verificação token
            jwt.verify(token,process.env.SECRETKEY, async (error,decoded) => {
                if(error || decoded.admin == false){
                    fs.unlinkSync(imagem.path);
                    return res.json({message:"unauthorized"});
                }else{
                    const noticia = await Noticia.findOne({_id:noticiaId});
                    noticia.manchete = manchete;
                    noticia.conteudo = conteudo;
                    await noticia.save();

                    const imagemNoticia = await ImagemNoticia.findOne({noticiaId:noticiaId});
                    fs.unlinkSync(imagemNoticia.diretorio);

                    imagemNoticia.url = "/uploads/"+imagem.filename;
                    imagemNoticia.diretorio = imagem.path;
                    await imagemNoticia.save();

                    return res.json({message:"success"});
                };
            });

        }else{
            fs.unlinkSync(imagem.path);
            return res.json({message:"invalid"});
        };
    }catch(err){
        return res.json({message:"error"});
    };
};