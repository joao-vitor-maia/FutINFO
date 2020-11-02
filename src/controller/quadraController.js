const jwt = require("jsonwebtoken");
const sanitize = require("sanitize-html");
const validator = require("validator");
const fns = require("date-fns");
const fs = require("fs");
const Quadra = require("@models/Quadra");
const Horario = require("@models/Horario");
const ImagemQuadra = require("@models/ImagemQuadra");
const ModalidadeQuadra = require("@models/ModalidadeQuadra");

exports.salvarQuadra = async (req,res) => {
    try{
        const nome = req.body.nome; 
        const descricao = req.body.descricao;
        const rua = req.body.rua; 
        const cep = req.body.cep; 
        const numeroRua = req.body.numeroRua;
        
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
exports.salvarPreco = async (req,res) => {
    try{
        const preco = req.body.preco 
        const promocao = req.body.promocao;
        
        //Validação
        if(validator.isLength(preco,{min:2,max:60}) && sanitize(preco,{allowedTags:[], allowedAttributes:{} }) == preco 
        ) {
            const token = req.headers["authorization"];
            
            jwt.verify(token,process.env.SECRETKEY, async (error,decoded) => {
                if(error || decoded.afiliado != true){
                    return res.json({message:"unauthorized"});
                }else{
                    const dadosQuadra = {
                        preco:preco,
                        promocao:promocao
                    };
                    const quadra = await Quadra.findOne({usuarioId:decoded.id}).sort({dataTimestamp:-1});
                    quadra.preco = preco;
                    quadra.promocao = promocao
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
exports.adicionarModalidade = async (req,res) => {
    try{
        const modalidade1 = req.body.modalidade1; 
        const modalidade2 = req.body.modalidade2;
        const modalidade3 = req.body.modalidade3; 
        const modalidade4 = req.body.modalidade4;
        
        //Validação
        if(validator.isLength(modalidade1,{max:60}) && sanitize(modalidade1,{allowedTags:[], allowedAttributes:{} }) == modalidade1 && 
        validator.isLength(modalidade2,{max:60}) && sanitize(modalidade2,{allowedTags:[], allowedAttributes:{} }) == modalidade2 &&
        validator.isLength(modalidade3,{max:60}) && sanitize(modalidade3,{allowedTags:[], allowedAttributes:{} }) == modalidade3 &&
        validator.isLength(modalidade4,{max:60}) && sanitize(modalidade4,{allowedTags:[], allowedAttributes:{} }) == modalidade4  
        ) {
            const token = req.headers["authorization"];
            
            jwt.verify(token,process.env.SECRETKEY, async (error,decoded) => {
                if(error || decoded.afiliado != true){
                    return res.json({message:"unauthorized"});
                }else{
                    //Busco quadra referente ao usuário e verifico se já existe modalidade relacionada a ela
                    const quadra = await Quadra.findOne({usuarioId:decoded.id});
                    const modalidade = await ModalidadeQuadra.findOne({quadraId:quadra._id});

                    if(modalidade) {
                        modalidade.modalidade1 = modalidade1;
                        modalidade.modalidade2 = modalidade2;
                        modalidade.modalidade3 = modalidade3;
                        modalidade.modalidade4 = modalidade4;

                        await modalidade.save();
                    }else{
                        const dados = {
                            modalidade1:modalidade1,
                            modalidade2:modalidade2,
                            modalidade3:modalidade3,
                            modalidade4:modalidade4,
                            quadraId:quadra._id
                        };


                        await new ModalidadeQuadra(dados).save();
                    };

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
exports.adicionarHorarioDisponivel = async(req,res) => {
    try{
        //Pegando informacoes        
        const token = req.headers["authorization"];
        const ano = req.body.ano;
        const mes = req.body.mes;
        const dia = req.body.dia;
        const HorarioInicial = req.body.horarioInicial;
        const HorarioFinal = req.body.horarioFinal;

        //Pegando dados da data
        const horarioInicial = new Date(`${ano},${mes},${dia} ${HorarioInicial}`);
        const horarioFinal = new Date(`${ano},${mes},${dia} ${HorarioFinal}`);

        //Horario inicial não pode ser maior ou igual ao final
        if(fns.compareAsc(horarioInicial,horarioFinal) == 1 || fns.compareAsc(horarioInicial,horarioFinal) == 0 ||
        !ano ||
        !mes || 
        !dia ||
        !HorarioInicial ||
        !HorarioFinal ){
            return res.json({message:"invalid"});

        }else{
            const horarioIntervalo = {
                start:horarioInicial,
                end:horarioFinal
            };

            jwt.verify(token,process.env.SECRETKEY, async(error,decoded) => {
                if(error || decoded.afiliado != true){
                    return res.json({message:"unauthorized"});

                }else{
                    const quadra = await Quadra.findOne({usuarioId:decoded.id});

                    const dados = {
                        usuarioId:decoded.id,
                        quadraId:quadra._id,
                        ano:ano,
                        mes:mes,
                        dia:dia,
                        solicitado:false,
                        aprovado:null,
                        horarioIntervalo:horarioIntervalo
                    };

                    await new Horario(dados).save();

                    return res.json({message:"success"});
                };
            });
        };
    }catch(err){
        console.log(err)
        return res.json({message:"error"});
    }
};
exports.deletarHorarioDisponivel = async (req,res) => {
    try{
        const token = req.headers["authorization"];
        const horarioId = req.body.horarioId;

        jwt.verify(token,process.env.SECRETKEY, async (error,decoded) => {
            if(error || decoded.afiliado != true){
                return res.json({message:"unauthorized"});
            }else{
                await Horario.findByIdAndDelete(horarioId);

                return res.json({message:"sucess"});
                
            };
        });
    }catch(err){
        return res.json({message:"error"});
    }
};