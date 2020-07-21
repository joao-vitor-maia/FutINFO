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
        const quadras = await Quadra.find().sort({data: -1}).limit(limit);
        const noticias = await Noticia.find().sort({data: -1}).skip(skip).limit(limit);
        
        const noticiasTotal = await Noticia.find();
        const pagesTotal = Math.ceil(noticiasTotal.length/limit );

        const time1Divisao = await Time.find({divisao: 1});
        const time2Divisao = await Time.find({divisao: 2});
        const time3Divisao = await Time.find({divisao: 3});
        const time4Divisao = await Time.find({divisao: 4});


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
exports.renderLogin = async (req, res) => {
    try {
        res.render("pages/login.handlebars");
    } catch (err) {
        return res.json({
            message: "error"
        });
    }
};
exports.renderCadastro = async (req, res) => {
    try {
        res.render("pages/cadastro.handlebars");
    } catch (err) {
        return res.json({
            message: "error"
        });
    };
};
exports.renderHorarioAfiliado = async (req, res) => {
    try{
        // const token = req.headers["Authorization"];

        // jwt.verify(token, process.env.SECRETKEY, async (error, decoded) => {
        //     if (error || decoded.afiliado != true) {
        //         res.redirect("/login");
        //     } else {
                //Pegando lista de horarios 
                const horariosPendentes = await Horario.find({aprovado: false}).populate("usuarioId").sort({data: "-1"});

                const horariosAprovados = await Horario.find({aprovado: true}).populate("usuarioId").sort({data: "-1"});

                res.render("pages/listagemHorarios", {
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
                    })
                });
        //     };
        // });
    }catch(err){
        return res.json({message: "error"});
    };
};
exports.renderRedefinirSenha = async (req,res) => {
    try {
        res.render("pages/redefinirSenha.handlebars");
    } catch (err) {
        return res.json({
            message: "error"
        });
    }
};
exports.renderRegistrarQuadra = async (req,res) => {
    try{
        res.render("pages/registrarQuadra");
    }catch(err){
        return res.json({message:"error"});
    };
};
exports.renderHorarioUsuario = async (req, res) => {
    try{
        // const token = req.headers["Authorization"];

        // jwt.verify(token, process.env.SECRETKEY, async (error, decoded) => {
        //     if (error) {
        //         res.redirect("/login");
        //     } else {
                //Pegando lista de horarios 
                const horariosPendentes = await Horario.find({aprovado: false}).populate("usuarioId").sort({data: "-1"});

                const horariosAprovados = await Horario.find({aprovado: true}).populate("usuarioId").sort({data: "-1"});

                res.render("pages/HorarioUsuario", {
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
                    })
                });
        //     };
        // });
    }catch(err){
        return res.json({message: "error"});
    };
};