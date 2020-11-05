const Time = require("@models/Time");
const jwt = require("jsonwebtoken");
const validator = require("validator");

exports.registrarTime = async (req,res) => {
    try{
        const token = req.headers["authorization"];
        
        const modalidade = req.body.modalidade;
        const categoria = req.body.categoria;
        const divisao = req.body.divisao;
        const classificacao = req.body.classificacao; 
        const nome = req.body.nome;
        const ponto = req.body.ponto;
        const jogo = req.body.jogo;
        const vitoria = req.body.vitoria;
        const derrota = req.body.derrota;
        const empate = req.body.empate;

        //Validação
        if((modalidade == "Campo" || modalidade == "Futsal") &&
        (categoria == "Masculino" || categoria == "Feminino") &&
        validator.isInt(divisao) &&
        validator.isLength(nome,{min:2,max:60}) && 
        validator.isInt(classificacao) &&
        validator.isInt(ponto) &&
        validator.isInt(jogo) &&
        validator.isInt(vitoria) &&
        validator.isInt(derrota) &&
        validator.isInt(empate) ){

            //Verificação token
            jwt.verify(token,process.env.SECRETKEY, async (error,decoded) => {
                if(error || decoded.admin == false){
                    return res.json({message:"unauthorized"});
                }else{
                    const dados = {
                        modalidade:modalidade,
                        categoria:categoria,
                        divisao:divisao,
                        nome:nome,
                        ponto:ponto,
                        jogo:jogo,
                        vitoria:vitoria,
                        derrota:derrota,
                        classificacao:classificacao,
                        empate:empate
                    };
                    await new Time(dados).save();

                    return res.json({message:"success"});
                };
            });

        }else{
            return res.json({message:"invalid"});
        };
    }catch(err){
        return res.json({message:"error"});
    };
};
exports.editarTime = async (req,res) => {
    try{
        const token = req.headers["authorization"];

        const timeId = req.body.timeId;
        const modalidade = req.body.modalidade;
        const categoria = req.body.categoria;
        const divisao = req.body.divisao;
        const classificacao = req.body.classificacao; 
        const nome = req.body.nome;
        const ponto = req.body.ponto;
        const jogo = req.body.jogo;
        const vitoria = req.body.vitoria;
        const derrota = req.body.derrota;
        const empate = req.body.empate;

        //Validação
        if((modalidade == "Campo" || modalidade == "Futsal") &&
        (categoria == "Masculino" || categoria == "Feminino") &&
        validator.isInt(divisao) &&
        validator.isLength(nome,{min:2,max:60}) && 
        validator.isInt(classificacao) &&
        validator.isInt(ponto) &&
        validator.isInt(jogo) &&
        validator.isInt(vitoria) &&
        validator.isInt(derrota) &&
        validator.isInt(empate) ){
            //Verificação token
            jwt.verify(token,process.env.SECRETKEY, async (error,decoded) => {
                if(error || decoded.admin == false){
                    return res.json({message:"unauthorized"});
                }else{
                    const time = await Time.findOne({_id:timeId});
                    time.modalidade = modalidade;
                    time.categoria = categoria;
                    time.divisao = divisao;
                    time.nome = nome;
                    time.ponto = ponto;
                    time.jogo = jogo;
                    time.vitoria = vitoria;
                    time.derrota = derrota;
                    time.classificacao = classificacao;
                    time.empate = empate;
                    await time.save();

                    return res.json({message:"success"});
                };
            });

        }else{
            return res.json({message:"invalid"});
        };
    }catch(err){
        return res.json({message:"error"});
    };
};