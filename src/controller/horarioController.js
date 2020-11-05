const Horario = require("@models/Horario");
const jwt = require("jsonwebtoken");
const fns = require("date-fns");
const nodemailer = require("nodemailer");

exports.solicitarHorario = async(req,res) => {
    try{
        //Pegando informacoes        
        const token = req.headers["authorization"];
        const quadraId = req.body.quadraId;
        const ano = req.body.ano;
        const mes = req.body.mes;
        const dia = req.body.dia;
        const HorarioInicial = req.body.horarioInicial;
        const HorarioFinal = req.body.horarioFinal;
        const modalidade = req.body.modalidade;

        //Pegando dados da data
        const horarioInicial = new Date(`${ano},${mes},${dia} ${HorarioInicial}`);
        const horarioFinal = new Date(`${ano},${mes},${dia} ${HorarioFinal}`);

        //Horario inicial não pode ser maior ou igual ao final
        if(fns.compareAsc(horarioInicial,horarioFinal) == 1 || fns.compareAsc(horarioInicial,horarioFinal) == 0 ){
            return res.json({message:"invalid"});

        }else{
            const horarioIntervalo = {
                start:horarioInicial,
                end:horarioFinal
            };

            //Verificação token
            jwt.verify(token,process.env.SECRETKEY, async(error,decoded) => {
                if(error){
                    return res.json({message:"unauthorized"});

                }else{
                    const dados = {
                        usuarioId:decoded.id,
                        quadraId:quadraId,
                        ano:ano,
                        mes:mes,
                        dia:dia,
                        solicitado:true,
                        modalidade:modalidade,
                        horarioIntervalo:horarioIntervalo
                    };

                    await new Horario(dados).save();

                    //Envio de email
                    // const quadra = await Quadra.findById(quadraId).populate("usuarioId");
                    // const donoQuadra = quadra.usuarioId;

                    // const transporter = nodemailer.createTransport({
                    //     host:"smtp.gmail.com",
                    //     port:587,
                    //     secure:false,
                    //     auth:{
                    //         user:"teste@gmail.com",
                    //         pass:"teste"
                    //     }
                    // });

                    // const message = await transporter.sendMail({
                    //     from:"FutINFO<teste>",
                    //     to:[donoQuadra.email],
                    //     subject:"Agendamento de horario",
                    //     html:"Olá voçê recebeu uma solicitação para agendamento de horarios."
                    // });
                    
                    return res.json({message:"success"});
                };
            });
        };
    }catch(err){
        return res.json({message:"error"});
    }
};
exports.aprovar = async(req,res) => {
    try{
        const token = req.headers["authorization"];
        const idHorario = req.body.idHorario;
        
        //Verificação token
        jwt.verify(token,process.env.SECRETKEY, async (error,decoded) => {
            if(error || decoded.afiliado == false){
                return res.json({message:"unauthorized"});
            }else{
                const horario = await Horario.findById(idHorario);
                horario.aprovado = "verdadeiro";
                await horario.save();
                return res.json({message:"success"})
            };
        });
    }catch(err){
        return res.json({message:"error"})
    }
};
exports.recusar = async(req,res) => {
    try{
        const token = req.headers["authorization"];
        const idHorario = req.body.idHorario;
        
        //Verificação token
        jwt.verify(token,process.env.SECRETKEY, async (error,decoded) => {
            if(error || decoded.afiliado == false){
                return res.json({message:"unauthorized"});
            }else{
                const horario = await Horario.findById(idHorario);
                horario.aprovado = "falso";
                await horario.save();
                return res.json({message:"success"})
            };
        });
    }catch(err){
        return res.json({message:"error"})
    }
};