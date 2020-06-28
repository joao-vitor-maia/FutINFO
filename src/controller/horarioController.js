const Horario = require("@models/Horario");
const Quadra = require("@models/Quadra");
const jwt = require("jsonwebtoken");
const fns = require("date-fns");
const nodemailer = require("nodemailer");

exports.agendarHorario = async(req,res) => {
    try{
        //Pegando informacoes        
        const token = req.body.token;
        const quadraId = req.body.quadraId;
        const ano = new Date().getFullYear();
        const mes = new Date().getMonth()+1;
        const dia = req.body.dia;
        const HorarioInicial = req.body.horarioInicial;
        const HorarioFinal = req.body.horarioFinal;

        //Data como horario inicial e final
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

            const horariosDoBanco = await Horario.find();
            
            for(let horarioDoBanco of horariosDoBanco){ 
                if(fns.areIntervalsOverlapping(horarioIntervalo,horarioDoBanco.horarioIntervalo)){
                    return res.json({message:"conflict"});
                }
            };

            jwt.verify(token,process.env.SECRETKEY, async(error,decoded) => {
                if(error){
                    return res.json({message:"unauthorized"});

                }else{
                    const dados = {
                        usuarioId:decoded.id,
                        quadraId:quadraId,
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
                    //     from:"FutINFO<jvitormaia123@gmail.com>",
                    //     to:[donoQuadra.email],
                    //     subject:"Agendamento de horario",
                    //     html:"Olá voçê recebeu uma solicitação para agendamento de horarios."
                    // });
                    
                    return res.json({message:"success"});
                };
            });
        };
    }catch(err){
        console.log(err)
        return res.json({message:"error"});
    }
}