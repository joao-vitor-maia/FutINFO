const Usuario = require("@models/Usuario");
const ImagemQuadra = require("@models/ImagemQuadra")
const Horario = require("@models/Horario");
const Quadra = require("@models/Quadra");
const Noticia = require("@models/Noticia");
const Time = require("@models/Time");
const fns = require("date-fns")
const jwt = require("jsonwebtoken");

exports.renderHome = async (req, res) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.decode(token);

        //Paginação
        const pageAtual = Number(req.params.page) || 1;
        const limit = 3;
        const skip = (pageAtual*limit)-limit;

        //Consultas
        const quadras = await Quadra.find().sort({data: -1}).limit(2);
        const noticias = await Noticia.find().sort({data: -1}).skip(skip).limit(limit);
        
        const noticiasTotal = await Noticia.find().sort({data: -1});
        const pagesTotal = Math.ceil(noticiasTotal.length/limit );

        const time1Divisao = await Time.find({divisao: 1}).sort({classificacao:1});
        const time2Divisao = await Time.find({divisao: 2}).sort({classificacao:1});
        const time3Divisao = await Time.find({divisao: 3}).sort({classificacao:1});
        const time4Divisao = await Time.find({divisao: 4}).sort({classificacao:1});

        res.render("pages/index", {
            pagination:{
                page:pageAtual,
                pageCount:pagesTotal 
            },
            quadras: await Promise.all(quadras.map(async (quadra) => {

                const imagens = await ImagemQuadra.find({quadraId:quadra._id}).sort({data:1}).limit(7)

                const dados = {
                    quadra: quadra.toJSON(),
                    imagens: imagens.map(imagem => imagem.toJSON())
                };
                    
                return dados;
            })),
            noticias: noticias.map(noticias => {
                noticias.data.data = fns.format(noticias.data.data, "dd/MM/yyyy");
                return noticias.toJSON();
            }),
            time1Divisao:time1Divisao.map(time => time.toJSON()),
            time2Divisao:time2Divisao.map(time => time.toJSON()),
            time3Divisao:time3Divisao.map(time => time.toJSON()),  
            time4Divisao:time4Divisao.map(time => time.toJSON()),
            decoded:decoded
        });
    }catch (err){
        return res.json({message: "error"});
    }
};
//Usuario
exports.renderHorarioUsuario = async (req, res) => {
    try{
        const decoded = req.decoded;

        //Pegando lista de horarios 
        const horariosPendentes = await Horario.find({usuarioId:decoded.id,aprovado: "pendente"}).populate("usuarioId").sort({data: "-1"});

        const horariosAprovados = await Horario.find({usuarioId:decoded.id,aprovado: "verdadeiro"}).populate("usuarioId").sort({data: "-1"});

        const horariosRecusados = await Horario.find({usuarioId:decoded.id,aprovado: "falso"}).populate("usuarioId").sort({data: "-1"});

        res.render("pages/Usuario/HorarioUsuario", {
            horarioPendente: horariosPendentes.map(horario => {
                //Formatando data para hora
                const horaInicial = fns.format(horario.horarioIntervalo.start, "HH:mm")
                const horaFinal = fns.format(horario.horarioIntervalo.end, "HH:mm")

                horario.horarioIntervalo.start = horaInicial;
                horario.horarioIntervalo.end = horaFinal;
                return horario.toJSON();
            }),
            horarioAprovado: horariosAprovados.map(horario => {
                //Formatando data para hora
                const horaInicial = fns.format(horario.horarioIntervalo.start, "HH:mm")
                const horaFinal = fns.format(horario.horarioIntervalo.end, "HH:mm")

                horario.horarioIntervalo.start = horaInicial;
                horario.horarioIntervalo.end = horaFinal;
                return horario.toJSON();
            }),
            horarioRecusado: horariosRecusados.map(horario => {
                //Formatando data para hora
                const horaInicial = fns.format(horario.horarioIntervalo.start, "HH:mm")
                const horaFinal = fns.format(horario.horarioIntervalo.end, "HH:mm")

                horario.horarioIntervalo.start = horaInicial;
                horario.horarioIntervalo.end = horaFinal;
                return horario.toJSON();
            })
        });
    }catch(err){
        return res.json({message: "error"});
    };
};
exports.renderLogin = async (req, res) => {
    try {
        res.render("pages/Usuario/login");
    } catch (err) {
        return res.json({
            message: "error"
        });
    }
};
exports.renderCadastro = async (req, res) => {
    try {
        res.render("pages/Usuario/cadastro");
    } catch (err) {
        return res.json({
            message: "error"
        });
    };
};
exports.renderRedefinirSenha = async (req,res) => {
    try {
        res.render("pages/Usuario/redefinirSenha");
    } catch(err){
        return res.json({message: "error"});
    }
};
exports.renderVerPerfil = async (req,res) => {
    try{
        const decoded = req.decoded;

        res.render("pages/Usuario/verPerfil",{
            nome:decoded.nome,
            email:decoded.email,
            senha:decoded.senha
        });
    }catch(err){
        return res.json({message:"error"});
    };
};
exports.renderEditarNome = async (req,res) => {
    try{
        const decoded = req.decoded;
        
        res.render("pages/Usuario/editarNome",{
            nome:decoded.nome
        });
    }catch(err){
        return res.json({message:"error"});
    };
};
//Afiliado
exports.renderRegistrarQuadra = async (req,res) => {
    try{
        const decoded = req.decoded;
        const quadra = await Quadra.findOne({usuarioId:decoded.id}).sort({data:-1});
        const horarios = await Horario.find({quadraId:quadra._id,aprovado:"pendente"}).sort({data:1}).populate("quadraId usuarioId");
        
        res.render("pages/Afiliado/registrarQuadra",{
            horariosLength:horarios.length
        });
    }catch(err){
        return res.json({message:"error"});
    };
};
exports.renderEditarQuadra = async (req,res) => {
    try{
        const decoded = req.decoded;
        const quadra = await Quadra.findOne({usuarioId:decoded.id}).sort({data:-1});
        const horarios = await Horario.find({quadraId:quadra._id,aprovado:"pendente"}).sort({data:1}).populate("quadraId usuarioId");

        res.render("pages/Afiliado/editarQuadra",{
            horariosLength:horarios.length
        });
    }catch(err){
        return res.json({message:"error"});
    };
};
exports.renderAfiliadoHistorico = async (req, res) => {
    try{
        const decoded = req.decoded;

        //Paginação
        const pageAtual = Number(req.params.page) || 1;
        const limit = 8;
        const skip = (pageAtual*limit)-limit;

        //Consulta
        const quadra = await Quadra.findOne({usuarioId:decoded.id}).sort({data:-1});
        const horarios = await Horario.find({quadraId:quadra._id,aprovado:"verdadeiro"}).sort({data:1}).populate("quadraId usuarioId").skip(skip).limit(limit);
        const horariosTotal = await Horario.find({usuarioId:decoded.id,aprovado:"verdadeiro"});
        const pagesTotal = Math.ceil(horariosTotal.length/limit);

        const horariosPendenteLength = await Horario.find({quadraId:quadra._id,aprovado:"pendente"});

        res.render("pages/Afiliado/AfiliadoHistorico",{
            pagination:{
                page:pageAtual,
                pageCount:pagesTotal
            },
            historico:horarios.map(horario => {
                horario.horarioIntervalo.start = fns.format(horario.horarioIntervalo.start,"HH:mm");
                horario.horarioIntervalo.end = fns.format(horario.horarioIntervalo.end,"HH:mm");
                return horario.toJSON();
            }),
            horariosLength:horariosPendenteLength.length
        })
    }catch(err){
        return res.json({message:"error"});
    }
};
exports.renderHorarioSolicitado = async (req, res) => {
    try{
        const decoded = req.decoded;
        
        const quadra = await Quadra.findOne({usuarioId:decoded.id});
        const horarios = await Horario.find({quadraId:quadra._id});
        
        res.render("pages/Afiliado/afiliado",{
            //Formatando hoario
            horarios:horarios.map(horario => {
                horario.horarioIntervalo.start = fns.format(horario.horarioIntervalo.start,"HH:mm");
                horario.horarioIntervalo.end = fns.format(horario.horarioIntervalo.end,"HH:mm");
                return horario.toJSON();
            }),
            horariosLength:horarios.length

        });
    } catch (err) {
        return res.json({message: "error"});
    };
};
exports.renderAdicionarImagens = async (req,res) => {
    try{
        const decoded = req.decoded;

        const quadra = await Quadra.findOne({usuarioId:decoded.id}).sort({data:-1});
        const horarios = await Horario.find({quadraId:quadra._id,aprovado:"pendente"}).sort({data:1}).populate("quadraId usuarioId");
        const imagens = await ImagemQuadra.find({quadraId:quadra._id}).limit(7);

        res.render("pages/Afiliado/adicionarimagens",{
            imagens:imagens.map(imagem => imagem.toJSON()),
            horariosLength:horarios.length
        });
    }catch(err){
        return res.json({message:"error"});
    };
};
exports.renderDeletarImagens = async (req,res) => {
    try{
        const decoded = req.decoded;
        
        const quadra = await Quadra.findOne({usuarioId:decoded.id}).sort({data:-1});
        const horarios = await Horario.find({quadraId:quadra._id,aprovado:"pendente"}).sort({data:1}).populate("quadraId usuarioId");
        const imagens = await ImagemQuadra.find({quadraId:quadra._id}).limit(7);

        res.render("pages/Afiliado/deletarimagens",{
            imagens:imagens.map(imagem => imagem.toJSON()),
            horariosLength:horarios.length
        });
    }catch(err){
        return res.json({message:"error"});
    };
};
exports.renderVerQuadra = async (req,res) => {
    try{
        const decoded = req.decoded;

        const quadra = await Quadra.findOne({usuarioId:decoded.id}).sort({data:-1});
        const horarios = await Horario.find({quadraId:quadra._id,aprovado:"pendente"}).sort({data:1}).populate("quadraId usuarioId");
        const imagens = await ImagemQuadra.find({quadraId:quadra._id}).limit(7);

        res.render("pages/Afiliado/afiliadoVerQuadra",{
            quadra:quadra.toJSON(),
            imagens:imagens.map(imagem => imagem.toJSON()),
            horariosLength:horarios.length
        });
    }catch(err){
        return res.json({message:"error"});
    };
};