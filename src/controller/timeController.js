const time = 
const jwt = require("jsonwebtoken");

exports.registrarTime = async (req,res) => {
    try{
        const divisao = req.body.divisao; 
        const nome = req.body.nome;
        const ponto = req.body.ponto;
        const jogo = req.body.jogo;
        const vitoria = req.body.vitoria;
        const derrota = req.body.derrota;

        if((divisao > 0 && divisao < 5 ) ||
        validator.isLength(nome,{min:2,max:60}) ){

            jwt.verify(token,process.env.SECRETKEY, async (error,decoded) => {
                if(error || decoded.admin == false){
                    return res.json({message:"unauthorized"});
                }else{
                    const dados = {
                        divisao:divisao,
                        nome:nome,
                        ponto:ponto,
                        jogo:jogo,
                        vitoria:vitoria,
                        derrota:derrota
                    };

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