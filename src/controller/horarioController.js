const Horario = require("@models/Horario");
const Quadra = require("@models/Quadra");
const jwt = require("jsonwebtoken");
const fns = require("date-fns");
const validator = require("validator");
const nodemailer = require("nodemailer");

exports.agendarHorario = async(req,res) => {
    try{
        //Pegando informacoes        
        const token = req.headers["authorization"];
        const quadraId = req.body.quadraId;
        const ano = req.body.ano;
        const mes = req.body.mes;
        const dia = req.body.dia;
        const HorarioInicial = req.body.horarioInicial;
        const HorarioFinal = req.body.horarioFinal;

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

            const horariosDoBanco = await Horario.find({quadraId:quadraId});
            
            for(let horarioDoBanco of horariosDoBanco){ 
                //Horários não podem se sobrepor
                if(fns.areIntervalsOverlapping(horarioIntervalo,horarioDoBanco.horarioIntervalo)){
                    return res.json({message:"conflict"});
                };
            };

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
                        horarioIntervalo:horarioIntervalo
                    };

                    await new Horario(dados).save();

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
        
        jwt.verify(token,process.env.SECRETKEY, async (error,decoded) => {
            if(error || decoded.afiliado != true){
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
        
        jwt.verify(token,process.env.SECRETKEY, async (error,decoded) => {
            if(error || decoded.afiliado != true){
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