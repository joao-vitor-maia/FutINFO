const Usuario = require("@models/Usuario");
const ImagemQuadra = require("@models/ImagemQuadra");
const ImagemNoticia = require("@models/ImagemNoticia");
const ModalidadeQuadra = require("@models/ModalidadeQuadra");
const Horario = require("@models/Horario");
const Quadra = require("@models/Quadra");
const Noticia = require("@models/Noticia");
const Artilheiro = require("@models/Artilheiro");
const Time = require("@models/Time");
const ResultadoJogo = require("@models/ResultadoJogo");
const fns = require("date-fns");
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
        const quadras = await Quadra.find().sort({dataTimestamp:-1}).limit(2);
        const noticias = await Noticia.find().sort({dataTimestamp:-1}).skip(skip).limit(limit);
        
        const noticiasTotal = await Noticia.find().sort({dataTimestamp:-1});
        const pagesTotal = Math.ceil(noticiasTotal.length/limit );

        const time1Divisao = await Time.find({divisao: 1, modalidade: "Campo", categoria: "Masculino"}).sort({classificacao:1});
        const time2Divisao = await Time.find({divisao: 2, modalidade: "Campo", categoria: "Masculino"}).sort({classificacao:1});
        const time3Divisao = await Time.find({divisao: 3, modalidade: "Campo", categoria: "Masculino"}).sort({classificacao:1});
        const time4Divisao = await Time.find({divisao: 4, modalidade: "Campo", categoria: "Masculino"}).sort({classificacao:1});

        res.render("pages/index", {
            pagination:{
                page:pageAtual,
                pageCount:pagesTotal 
            },
            quadras: await Promise.all(quadras.map(async (quadra) => {
                const imagens = await ImagemQuadra.find({quadraId:quadra._id}).sort({dataTimestamp:1}).limit(7);

                const dados = {
                    quadra: quadra.toJSON(),
                    imagens: imagens.map(imagem => imagem.toJSON())
                };
                    
                return dados;
            })),
            noticias: await Promise.all(noticias.map(async (noticia) => {
                const imagem = await ImagemNoticia.findOne({noticiaId:noticia._id});
                const dados = {
                    noticia:noticia.toJSON(),
                    data:fns.format(noticia.data, "dd/MM/yyyy"),
                    imagem:imagem.toJSON()
                };

                return dados;
            })),
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
exports.renderQuadra = async (req,res) => {
    try{
        const token = req.cookies.token;
        const decoded = jwt.decode(token);
        const quadras = await Quadra.find();
        
        res.render("pages/quadras",{
            quadras:await Promise.all(quadras.map(async (quadra) => {
                const imagens = await ImagemQuadra.find({quadraId:quadra._id}).sort({dataTimestamp:1}).limit(7);
                const modalidade = await ModalidadeQuadra.findOne({quadraId:quadra._id}).sort({dataTimestamp:1});
                const horariosDisponiveis = await Horario.find({quadraId:quadra._id, solicitado:false}).sort({dataTimestamp:1});
        
                //Se existir modalidade crio o JSON com modalidade, se não crio a mesma estrutura JSON sem modalidade
                if(modalidade) {
                    var dados = {
                        quadra: quadra.toJSON(),
                        imagens: imagens.map(imagem => imagem.toJSON()),
                        modalidades: modalidade.toJSON(),
                        datasDisponiveis:horariosDisponiveis.map(horarioDisponivel => {
                            return {
                                ano:horarioDisponivel.ano,
                                mes:horarioDisponivel.mes,
                                dia:horarioDisponivel.dia
                            };
                        }),
                        horariosDisponiveis: horariosDisponiveis.map(horarioDisponivel => {
                            horarioDisponivel.horarioIntervalo.start = fns.format(horarioDisponivel.horarioIntervalo.start,"HH:mm");
                            horarioDisponivel.horarioIntervalo.end = fns.format(horarioDisponivel.horarioIntervalo.end,"HH:mm");
                            return horarioDisponivel.toJSON();
                        })
                    };
                }else {
                    var dados = {
                        quadra: quadra.toJSON(),
                        imagens: imagens.map(imagem => imagem.toJSON()),
                        datasDisponiveis:horariosDisponiveis.map(horarioDisponivel => {
                            return {
                                ano:horarioDisponivel.ano,
                                mes:horarioDisponivel.mes,
                                dia:horarioDisponivel.dia
                            };
                        }),
                        horariosDisponiveis: horariosDisponiveis.map(horarioDisponivel => {
                            horarioDisponivel.horarioIntervalo.start = fns.format(horarioDisponivel.horarioIntervalo.start,"HH:mm");
                            horarioDisponivel.horarioIntervalo.end = fns.format(horarioDisponivel.horarioIntervalo.end,"HH:mm");
                            return horarioDisponivel.toJSON();
                        })
                    };
                };

                return dados;
            })),
            decoded:decoded
        });
    }catch(err){
        return res.json({message:"error"});
    };
};
exports.renderClassificacaoEArtilheiro = async (req,res) => {
    try{
        const token = req.cookies.token;
        const decoded = jwt.decode(token);

        //Paginação
        const pageAtual = Number(req.params.page) || 1;

        const times = await Time.find({divisao: pageAtual}).sort({classificacao: 1});

        //Array será dividido por rodada
        const resultadoJogosRodada = [];

        //Loop com rodada atual
        for (i = 1; i <= 4; i++) {
            var resultadoJogos = await ResultadoJogo.find({divisao: pageAtual, rodada: i})
            .populate("timeId1").populate("timeId2").sort({dataTimestamp: "1"});
            
            if(resultadoJogos.length > 0) {
                resultadoJogosRodada.push({
                    resultadoJogos: resultadoJogos.map(resultadoJogo => resultadoJogo.toJSON()),
                    rodadaAtual:i
                });
            };
        };

        const artilheiros = await Artilheiro.find({divisao: pageAtual})
        .populate("timeId").sort({classificacao: 1});

        const pagesTotal = 20;
        res.render("pages/ClassificacaoeArtilheiros", {
            pagination:{
                page:pageAtual,
                pageCount:pagesTotal 
            },
            times:times.map(time => time.toJSON()),
            resultadoJogosRodada:resultadoJogosRodada,
            artilheiros:artilheiros.map(artilheiro => artilheiro.toJSON()),
            divisao:pageAtual,
            decoded:decoded
        });
    }catch(err){
        return res.json({message:"error"});
    };
};
exports.renderClassificacaoEArtilheiroMasculinoCampo = async (req,res) => {
    try{
        const token = req.cookies.token;
        const decoded = jwt.decode(token);

        //Paginação
        const pageAtual = Number(req.params.page) || 1;
        
        const times = await Time.find({divisao: pageAtual, categoria:"Masculino", modalidade:"Campo"}).sort({classificacao: 1});

        //Array será dividido por rodada
        const resultadoJogosRodada = [];

        //Loop com rodada atual
        for (i = 1; i <= 4; i++) {
            var resultadoJogos = await ResultadoJogo.find({divisao: pageAtual, rodada: i, categoria:"Masculino", modalidade:"Campo"})
            .populate("timeId1").populate("timeId2").sort({dataTimestamp: "1"});
            
            if(resultadoJogos.length > 0) {
                resultadoJogosRodada.push({
                    resultadoJogos: resultadoJogos.map(resultadoJogo => resultadoJogo.toJSON()),
                    rodadaAtual:i
                });
            };
        };

        const artilheiros = await Artilheiro.find({divisao: pageAtual, categoria:"Masculino", modalidade:"Campo"})
        .populate("timeId").sort({classificacao: 1});

        const pagesTotal = 20;
        res.render("pages/ClassificacaoMasculinoCampo", {
            pagination:{
                page:pageAtual,
                pageCount:pagesTotal 
            },
            times:times.map(time => time.toJSON()),
            resultadoJogosRodada:resultadoJogosRodada,
            artilheiros:artilheiros.map(artilheiro => artilheiro.toJSON()),
            divisao:pageAtual,
            decoded:decoded
        });
    }catch(err){
        return res.json({message:"error"});
    };
};
exports.renderClassificacaoEArtilheiroMasculinoFutsal = async (req,res) => {
    try{
        const token = req.cookies.token;
        const decoded = jwt.decode(token);

        //Paginação
        const pageAtual = Number(req.params.page) || 1;

        const times = await Time.find({divisao: pageAtual, categoria:"Masculino", modalidade:"Futsal"}).sort({classificacao: 1});

        //Array será dividido por rodada
        const resultadoJogosRodada = [];

        //Loop com rodada atual
        for (i = 1; i <= 4; i++) {
            var resultadoJogos = await ResultadoJogo.find({divisao: pageAtual, rodada: i, categoria:"Masculino", modalidade:"Futsal"})
            .populate("timeId1").populate("timeId2").sort({dataTimestamp: "1"});
            
            if(resultadoJogos.length > 0) {
                resultadoJogosRodada.push({
                    resultadoJogos: resultadoJogos.map(resultadoJogo => resultadoJogo.toJSON()),
                    rodadaAtual:i
                });
            };
        };

        const artilheiros = await Artilheiro.find({divisao: pageAtual, categoria:"Masculino", modalidade:"Futsal"})
        .populate("timeId").sort({classificacao: 1});

        const pagesTotal = 20;
        res.render("pages/classificacaoMasculinoFutsal", {
            pagination:{
                page:pageAtual,
                pageCount:pagesTotal 
            },
            times:times.map(time => time.toJSON()),
            resultadoJogosRodada:resultadoJogosRodada,
            artilheiros:artilheiros.map(artilheiro => artilheiro.toJSON()),
            divisao:pageAtual,
            decoded:decoded
        });
    }catch(err){
        return res.json({message:"error"});
    };
};
exports.renderClassificacaoEArtilheiroFemininoCampo = async (req,res) => {
    try{
        const token = req.cookies.token;
        const decoded = jwt.decode(token);

        //Paginação
        const pageAtual = Number(req.params.page) || 1;

        const times = await Time.find({divisao: pageAtual, categoria:"Feminino", modalidade:"Campo"}).sort({classificacao: 1});

        //Array será dividido por rodada
        const resultadoJogosRodada = [];

        //Loop com rodada atual
        for (i = 1; i <= 4; i++) {
            var resultadoJogos = await ResultadoJogo.find({divisao: pageAtual, rodada: i, categoria:"Feminino", modalidade:"Campo"})
            .populate("timeId1").populate("timeId2").sort({dataTimestamp: "1"});
            
            if(resultadoJogos.length > 0) {
                resultadoJogosRodada.push({
                    resultadoJogos: resultadoJogos.map(resultadoJogo => resultadoJogo.toJSON()),
                    rodadaAtual:i
                });
            };
        };

        const artilheiros = await Artilheiro.find({divisao: pageAtual, categoria:"Feminino", modalidade:"Campo"})
        .populate("timeId").sort({classificacao: 1});

        const pagesTotal = 20;
        res.render("pages/classificacaoFemininoCampo", {
            pagination:{
                page:pageAtual,
                pageCount:pagesTotal 
            },
            times:times.map(time => time.toJSON()),
            resultadoJogosRodada:resultadoJogosRodada,
            artilheiros:artilheiros.map(artilheiro => artilheiro.toJSON()),
            divisao:pageAtual,
            decoded:decoded
        });
    }catch(err){
        return res.json({message:"error"});
    };
};
exports.renderClassificacaoEArtilheiroFemininoFutsal = async (req,res) => {
    try{
        const token = req.cookies.token;
        const decoded = jwt.decode(token);

        //Paginação
        const pageAtual = Number(req.params.page) || 1;

        const times = await Time.find({divisao: pageAtual, categoria:"Feminino", modalidade:"Futsal"}).sort({classificacao: 1});

        //Array será dividido por rodada
        const resultadoJogosRodada = [];

        //Loop com rodada atual
        for (i = 1; i <= 4; i++) {
            var resultadoJogos = await ResultadoJogo.find({divisao: pageAtual, rodada: i, categoria:"Feminino", modalidade:"Futsal"})
            .populate("timeId1").populate("timeId2").sort({dataTimestamp: "1"});
            
            if(resultadoJogos.length > 0) {
                resultadoJogosRodada.push({
                    resultadoJogos: resultadoJogos.map(resultadoJogo => resultadoJogo.toJSON()),
                    rodadaAtual:i
                });
            };
        };

        const artilheiros = await Artilheiro.find({divisao: pageAtual, categoria:"Feminino", modalidade:"Futsal"})
        .populate("timeId").sort({classificacao: 1});

        const pagesTotal = 20;
        res.render("pages/classificacaoFemininoFutsal.handlebars", {
            pagination:{
                page:pageAtual,
                pageCount:pagesTotal 
            },
            times:times.map(time => time.toJSON()),
            resultadoJogosRodada:resultadoJogosRodada,
            artilheiros:artilheiros.map(artilheiro => artilheiro.toJSON()),
            divisao:pageAtual,
            decoded:decoded
        });
    }catch(err){
        return res.json({message:"error"});
    };
};
//--- Usuario ---
exports.renderHorarioUsuario = async (req, res) => {
    try{
        const decoded = req.decoded;

        //Pegando lista de horarios 
        const horariosPendentes = await Horario.find({usuarioId:decoded.id,aprovado: "pendente"}).populate("usuarioId").sort({dataTimestamp:"-1"});

        const horariosAprovados = await Horario.find({usuarioId:decoded.id,aprovado: "verdadeiro"}).populate("usuarioId").sort({dataTimestamp:"-1"});

        const horariosRecusados = await Horario.find({usuarioId:decoded.id,aprovado: "falso"}).populate("usuarioId").sort({dataTimestamp:"-1"});

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
        return res.json({message: "error"});
    }
};
exports.renderCadastro = async (req, res) => {
    try {
        res.render("pages/Usuario/cadastro");
    } catch (err) {
        return res.json({message: "error"});
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
        const usuario = await Usuario.findOne({email:decoded.email});

        res.render("pages/Usuario/verPerfil",{
            nome:usuario.nome,
            email:usuario.email,
            senha:usuario.senha,
            telefone:usuario.telefone
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
exports.renderEditarEmail = async (req,res) => {
    try{
        const decoded = req.decoded;
        
        res.render("pages/Usuario/editarEmail",{
            email:decoded.email
        });
    }catch(err){
        return res.json({message:"error"});
    };
};
exports.renderEditarSenha = async (req,res) => {
    try{
        const decoded = req.decoded;
        
        res.render("pages/Usuario/editarSenha",{
            senha:decoded.senha
        });
    }catch(err){        
        return res.json({message:"error"});
    };
};
exports.renderEditarTelefone = async (req,res) => {
    try{
        const decoded = req.decoded;
        const usuario = await Usuario.findOne({_id:decoded.id})

        res.render("pages/Usuario/editarTelefone",{
            telefone:usuario.telefone
        });
    }catch(err){        
        return res.json({message:"error"});
    };
};
//--- Afiliado ---
exports.renderRegistrarQuadra = async (req,res) => {
    try{
        const decoded = req.decoded;
        const quadra = await Quadra.findOne({usuarioId:decoded.id}).sort({dataTimestamp:-1});
        if(quadra){
            res.redirect("/afiliado/ver-quadra");
        }else{
            res.render("pages/Afiliado/registrarQuadra");
        };
    }catch(err){
        return res.json({message:"error"});
    };
};
exports.renderEditarQuadra = async (req,res) => {
    try{
        const decoded = req.decoded;
        const quadra = await Quadra.findOne({usuarioId:decoded.id}).sort({dataTimestamp:-1});
        const horarios = await Horario.find({quadraId:quadra._id,aprovado:"pendente"}).sort({dataTimestamp:1}).populate("quadraId usuarioId");

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
        const quadra = await Quadra.findOne({usuarioId:decoded.id}).sort({dataTimestamp:-1});
        const horarios = await Horario.find({quadraId:quadra._id,aprovado:"verdadeiro"}).sort({dataTimestamp:1}).populate("quadraId usuarioId").skip(skip).limit(limit);
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
        const horarios = await Horario.find({quadraId:quadra._id,aprovado:"pendente",solicitado:true}).populate("quadraId").populate("usuarioId");
        
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

        const quadra = await Quadra.findOne({usuarioId:decoded.id}).sort({dataTimestamp:-1});
        const horarios = await Horario.find({quadraId:quadra._id,aprovado:"pendente"}).sort({dataTimestamp:1}).populate("quadraId usuarioId");
        const imagens = await ImagemQuadra.find({quadraId:quadra._id}).limit(7);

        res.render("pages/Afiliado/adicionarimagens",{
            imagens:imagens.map(imagem => imagem.toJSON()),
            horariosLength:horarios.length
        });
    }catch(err){
        return res.json({message:"error"});
    };
};
exports.renderAdicionarHorarioDisponivel = async (req,res) => {
    try{
        const decoded = req.decoded;
        const quadra = await Quadra.findOne({usuarioId:decoded.id}).sort({dataTimestamp:-1});
        const horariosDisponiveis = await Horario.find({quadraId:quadra._id, solicitado:false}).sort({dataTimestamp:1});

        res.render("pages/Afiliado/adicionarHorario",{
            horariosDisponiveis:horariosDisponiveis.map(horarioDisponivel => {
                horarioDisponivel.horarioIntervalo.start = fns.format(horarioDisponivel.horarioIntervalo.start,"HH:mm");
                horarioDisponivel.horarioIntervalo.end = fns.format(horarioDisponivel.horarioIntervalo.end,"HH:mm");
                return horarioDisponivel.toJSON();
            })
        });
    }catch(err){
        return res.json({message:"error"});
    };
};
exports.renderDeletarImagens = async (req,res) => {
    try{
        const decoded = req.decoded;
        
        const quadra = await Quadra.findOne({usuarioId:decoded.id}).sort({dataTimestamp:-1});
        const horarios = await Horario.find({quadraId:quadra._id,aprovado:"pendente"}).sort({dataTimestamp:1}).populate("quadraId usuarioId");
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

        const quadra = await Quadra.findOne({usuarioId:decoded.id}).sort({dataTimestamp:-1});
        const horarios = await Horario.find({quadraId:quadra._id,aprovado:"pendente"}).sort({dataTimestamp:1}).populate("quadraId usuarioId");
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
exports.renderRegistrarPreco = async (req,res) => {
    try{
        res.render("pages/Afiliado/registrarPreco");
    }catch(err){
        return res.json({message:"error"});
    };
};
exports.renderAdicionarModalidade = async (req,res) => {
    try{
        res.render("pages/Afiliado/adicionarModalidades");
    }catch(err){
        return res.json({message:"error"});
    };
};
//--- Admin ---
exports.renderAdicionarNoticia = async (req,res) => {
    try{
        res.render("pages/Admin/Noticia");
    }catch(err){
        return res.json({message:"error"});
    };
};
exports.renderAdicionarTime = async (req,res) => {
    try{
        res.render("pages/Admin/Classificacao");
    }catch(err){
        return res.json({message:"error"});
    };
};
exports.renderAdicionarResultadoJogo = async (req,res) => {
    try{
        res.render("pages/Admin/resultadoJogos");
    }catch(err){
        return res.json({message:"error"});
    };
};
exports.renderAdicionarArtilheiro = async (req,res) => {
    try{
        res.render("pages/Admin/Artilheiros");
    }catch(err){
        return res.json({message:"error"});
    };
};
exports.renderAdicionarAfiliado = async (req,res) => {
    try{
        res.render("pages/Admin/adicionarAfiliado");
    }catch(err){
        return res.json({message:"error"});
    };
};

exports.renderEditarNoticia = async (req,res) => {
    try{
        const noticiaId = req.params.noticiaId;
        
        res.render("pages/Admin/editarNoticias",{
            noticiaId:noticiaId
        });
    }catch(err){
        return res.json({message:"error"});
    };
};
exports.renderEditarArtilheiro = async (req,res) => {
    try{
        const artilheiroId = req.params.artilheiroId;

        res.render("pages/Admin/editarArtilheiros",{
            artilheiroId:artilheiroId
        });
    }catch(err){
        return res.json({message:"error"});
    };
};
exports.renderEditarTime = async (req,res) => {
    try{
        const timeId = req.params.timeId;

        res.render("pages/Admin/editarClassificacao",{
            timeId:timeId
        });
    }catch(err){
        return res.json({message:"error"});
    };
};
exports.renderEditarResultadoJogo = async (req,res) => {
    try{
        const resultadoJogoId = req.params.resultadoJogoId;

        res.render("pages/Admin/editarResultados",{
            resultadoJogoId:resultadoJogoId
        });
    }catch(err){
        return res.json({message:"error"});
    };
};