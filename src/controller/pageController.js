const Usuario = require("@models/Usuario");
const Horario = require("@models/Horario");
const Quadra = require("@models/Quadra");
const Noticia = require("@models/Noticia");
const Time = require("@models/Time");
const fns = require("date-fns")
const jwt = require("jsonwebtoken");

exports.renderHome = async (req, res) => {
    try {
        const quadras = await Quadra.find();
        const noticias = await Noticia.find().sort({
            divisao: 1
        });
        const time1Divisao = await Time.find({
            divisao: 1
        });
        const time2Divisao = await Time.find({
            divisao: 2
        });
        const time3Divisao = await Time.find({
            divisao: 3
        });
        const time4Divisao = await Time.find({
            divisao: 4
        });

        res.render("pages/index", {
            quadras: quadras.map(quadras => quadras.toJSON()),
            noticias: noticias.map(noticias => noticias.toJSON()),
            time1Divisao: time1Divisao.map(times => times.toJSON()),
            time2Divisao: time2Divisao.map(times => times.toJSON()),
            time3Divisao: time3Divisao.map(times => times.toJSON()),
            time4Divisao: time4Divisao.map(times => times.toJSON())
        });
    } catch (err) {
        console.log(err)
        return res.json({
            message: "error"
        });
    }
}
exports.renderLogin = async (req, res) => {
    try {
        res.render("pages/login.handlebars");
    } catch (err) {
        return res.json({
            message: "error"
        });
    }
}
exports.renderCadastro = async (req, res) => {
    try {
        res.render("pages/cadastro.handlebars");
    } catch (err) {
        return res.json({
            message: "error"
        });
    };
}
exports.renderListagemHorarios = async (req, res) => {
    try{
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmMDY1OThkYmEzOTAzMTQ1NDAyOWFjMyIsIm5vbWUiOiJndXN0YXZvIiwiZW1haWwiOiJndXN0YXZvQGdtYWlsLmNvbSIsImFmaWxpYWRvIjp0cnVlLCJhZG1pbiI6ZmFsc2UsImlhdCI6MTU5NDMwMDY5MSwiZXhwIjoxNTk0MzM2NjkxfQ.dvf8KcuF9JmGkI_T-2QXDfddSNp7Cxe5ZL45LcYWvhI";

        jwt.verify(token, process.env.SECRETKEY, async (error, decoded) => {
            if (error || decoded.afiliado != true) {
                return res.json({message: "unauthorized"});
            } else {
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
            };
        });
    }catch(err){
        return res.json({message: "error"});
    };
}