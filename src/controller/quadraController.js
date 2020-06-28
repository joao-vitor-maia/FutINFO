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

        const nomeImagem = req.body.nomeImagem;
        const imagemBase64 = [];
        
        //Validação
        if(validator.isLength(nome,{min:2,max:60}) && sanitize(nome,{allowedTags:[], allowedAttributes:{} }) == nome && Object.entries(quadraComNomeIgual).length == 0 &&
        validator.isLength(rua,{min:2,max:60}) && sanitize(rua,{allowedTags:[], allowedAttributes:{} }) == rua &&
        validator.isLength(cep,{min:8,max:9}) && sanitize(cep,{allowedTags:[], allowedAttributes:{} }) == cep && /[0-9]{5}-[0-9]{3}/.test(cep) &&
        validator.isLength(bairro,{min:2,max:60}) && sanitize(bairro,{allowedTags:[], allowedAttributes:{} }) == bairro &&
        validator.isLength(nomeImagem,{min:2,max:60}) && sanitize(nomeImagem,{allowedTags:[], allowedAttributes:{} }) == nomeImagem)
        {
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
                        for(imagem of imagemBase64){
                            const dadosImagem = {
                                quadraId:quadra._id,
                                nome:nomeImagem,
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
}