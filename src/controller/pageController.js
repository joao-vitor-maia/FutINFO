const Usuario = require("@models/Usuario");
const Horario = require("@models/Horario");
const Quadra = require("@models/Quadra");
const Noticia = require("@models/Noticia");
const Time = require("@models/Time");
const fns = require("date-fns")
const jwt = require("jsonwebtoken");

exports.renderHome = async (req, res) => {
    try {
        //Paginação
        const pageAtual = Number(req.params.page) || 1;
        const limit = 3;
        const skip = (pageAtual*limit)-limit;

        //Consultas
        const quadras = await Quadra.find().sort({data: -1}).limit(2);
        const noticias = await Noticia.find().sort({data: -1}).skip(skip).limit(limit);
        
        const noticiasTotal = await Noticia.find();
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
            quadras: quadras.map(quadras => quadras.toJSON()),
            noticias: noticias.map(noticias => {
                noticias.data.data = fns.format(noticias.data.data, "dd/MM/yyyy");
                return noticias.toJSON();
            }),
            time1Divisao:time1Divisao.map(time => time.toJSON()),
            time2Divisao:time2Divisao.map(time => time.toJSON()),
            time3Divisao:time3Divisao.map(time => time.toJSON()),  
            time4Divisao:time4Divisao.map(time => time.toJSON()),
        });
    }catch (err){
        return res.json({message: "error"});
    }
};
//Usuario
exports.renderHorarioUsuario = async (req, res) => {
    try{
        // const token = req.headers["Authorization"];

        // jwt.verify(token, process.env.SECRETKEY, async (error, decoded) => {
        //     if (error) {
        //         res.redirect("/login");
        //     } else {
                //Pegando lista de horarios 
                const horariosPendentes = await Horario.find({aprovado: "pendente"}).populate("usuarioId").sort({data: "-1"});

                const horariosAprovados = await Horario.find({aprovado: "verdadeiro"}).populate("usuarioId").sort({data: "-1"});

                const horariosRecusados = await Horario.find({aprovado: "falso"}).populate("usuarioId").sort({data: "-1"});

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
        //     };
        // });
    }catch(err){
        return res.json({message: "error"});
    };
};
exports.renderLogin = async (req, res) => {
    try {
        res.render("pages/Usuario/login.handlebars");
    } catch (err) {
        return res.json({
            message: "error"
        });
    }
};
exports.renderCadastro = async (req, res) => {
    try {
        res.render("pages/Usuario/cadastro.handlebars");
    } catch (err) {
        return res.json({
            message: "error"
        });
    };
};
exports.renderRedefinirSenha = async (req,res) => {
    try {
        res.render("pages/Usuario/redefinirSenha.handlebars");
    } catch (err) {
        return res.json({
            message: "error"
        });
    }
};
//Afiliado
exports.renderRegistrarQuadra = async (req,res) => {
    try{
        res.render("pages/registrarQuadra");
    }catch(err){
        return res.json({message:"error"});
    };
};
exports.renderAfiliadoHistorico = async (req, res) => {
    try{
        //Paginação
        const pageAtual = Number(req.params.page) || 1;
        const limit = 8;
        const skip = (pageAtual*limit)-limit;

        //Consulta
        const horarios = await Horario.find({aprovado:"verdadeiro"}).sort({data:1}).populate("quadraId usuarioId").skip(skip).limit(limit);
        const horariosTotal = await Horario.find({aprovado:"verdadeiro"});
        const pagesTotal = Math.ceil(horariosTotal.length/limit );

        const horariosPendenteLength = await Horario.find({aprovado:"pendente"});

        res.render("pages/Afiliado/AfiliadoHistorico",{
            pagination:{
                page:pageAtual,
                pageCount:pagesTotal
            },
            historico:horarios.map(horario => {
                horario.quadraId.precoHora.valor = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(horario.quadraId.precoHora.valor);
                horario.horarioIntervalo.start = fns.format(horario.horarioIntervalo.start,"HH:mm");
                horario.horarioIntervalo.end = fns.format(horario.horarioIntervalo.end,"HH:mm");
                return horario.toJSON();
            }),
            horarioLength:horariosPendenteLength.length
        })
    }catch(err){
        console.log(err)
        return res.json({message:"error"});
    }
};
exports.renderHorarioSolicitado = async (req, res) => {
    try{
        // const token = req.headers["Authorization"];

        // jwt.verify(token, process.env.SECRETKEY, async (error, decoded) => {
        //     if (error || decoded.afiliado != true) {
        //         res.redirect("/usuario/login");
        //     }else {
                    // //peguei todas as quadras no nome do admin, peguei os horarios delas (ou seja todos os horarios solicitados)
                    // const quadras = await Quadra.find({_id:decoded.id});
                    // const horarios = quadras.map(async (quadra) => {
                    //     return await Horario.find({quadraId:quadra._id})
                    // });
                    const horarios = await Horario.find({aprovado:"pendente"}).sort({data:1}).populate("quadraId usuarioId");
                    res.render("pages/Afiliado/afiliado.handlebars",{
                        //Formatando hoario
                        horarios:horarios.map(horario => {
                            horario.horarioIntervalo.start = fns.format(horario.horarioIntervalo.start,"HH:mm");
                            horario.horarioIntervalo.end = fns.format(horario.horarioIntervalo.end,"HH:mm");
                            return horario.toJSON();
                        }),
                        horariosLength:horarios.length

                    });
        //     };
        // }); 
    } catch (err) {
        console.log(err)
        return res.json({
            message: "error"
        });
    }
};