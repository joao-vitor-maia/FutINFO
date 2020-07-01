const Quadra = require("@models/Quadra");
const Noticia = require("@models/Noticia");
const Time = require("@models/Time");

exports.renderHome = async (req,res) => {
    try{
        const quadras = await Quadra.find();
        const noticias = await Noticia.find().sort({divisao:1});
        const time1Divisao = await Time.find({divisao:1});
        const time2Divisao = await Time.find({divisao:2});
        const time3Divisao = await Time.find({divisao:3});
        const time4Divisao = await Time.find({divisao:4});

        res.render("pages/index",{
            quadras:quadras.map(quadras => quadras.toJSON()),
            noticias:noticias.map(noticias => noticias.toJSON()),
            time1Divisao:time1Divisao.map(times => times.toJSON()),
            time2Divisao:time2Divisao.map(times => times.toJSON()),
            time3Divisao:time3Divisao.map(times => times.toJSON()),
            time4Divisao:time4Divisao.map(times => times.toJSON())
        });
    }catch(err){
        console.log(err)
        return res.json({message:"error"});
    }
}