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
        //Validando dados
        if(validator.isLength(manchete,{min:2}) &&
        validator.isLength(conteudo,{min:2})){
            
            jwt.verify(token,process.env.SECRETKEY, async (error,decoded) => {
                if(error || decoded.admin == false){
                    fs.unlinkSync(imagem.path);
                    return res.json({message:"unauthorized"});
                }else{
                    const dadosNoticia = {
                        manchete:manchete,
                        conteudo:conteudo
                    };
                    const noticia = await Noticia(dadosNoticia).save();

                    const dadosImagem = {
                        noticiaId:noticia._id,
                        url:"/uploads/"+imagem.filename,
                        diretorio:imagem.path
                    };
                    await ImagemNoticia(dadosImagem).save();
                    return res.json({message:"success"});
                };
            });

        }else{
            fs.unlinkSync(imagem.path);
            return res.json({message:"invalid"});
        };
    }catch(error){
        return res.json({message:"error"});
    };
};
exports.editarNoticia = async (req,res) => {
    try{
        const token = req.headers["authorization"];
        const noticiaId = req.noticiaId;

        const manchete = req.body.manchete;
        const conteudo = req.body.conteudo; 
        const imagem = req.file;

        //Verificando se ocorreu algum problema no fileFilter
        if(req.fileType){
            fs.unlinkSync(imagem.path);
            return res.json({message:"invalidType"});
        };
        //Validando dados
        if(validator.isLength(manchete,{min:2}) &&
        validator.isLength(conteudo,{min:2})){
            
            jwt.verify(token,process.env.SECRETKEY, async (error,decoded) => {
                if(error || decoded.admin == false){
                    fs.unlinkSync(imagem.path);
                    return res.json({message:"unauthorized"});
                }else{
                    const noticia = await Noticia({_id:noticiId});
                    noticia.manchete = manchete;
                    noticia.conteudo = conteudo;
                    noticia.save();

                    const dadosImagem = {
                        noticiaId:noticia._id,
                        url:"/uploads/"+imagem.filename,
                        diretorio:imagem.path
                    };
                    const imagemNoticia = await ImagemNoticia({noticiaId:noticiaId});
                    fs.unlinkSync(imagemNoticia.diretorio);

                    imagemNoticia.url = "/uploads/"+imagem.filename;
                    imagemNoticia.diretorio = imagem.path;
                    imagemNoticia.save();

                    return res.json({message:"success"});
                };
            });

        }else{
            fs.unlinkSync(imagem.path);
            return res.json({message:"invalid"});
        };
    }catch(error){
        return res.json({message:"error"});
    };
};