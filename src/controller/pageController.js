const Quadra = require("@models/Quadra");
const Noticia = require("@models/Noticia");

exports.renderHome = async (req,res) => {
    try{
        const quadras = await Quadra.find();
        const noticias = await Noticia.find().sort({divisao:1});

        res.render("pages/index",{
            quadras:quadras.map(quadras => quadras.toJSON()),
            noticias:noticias.map(noticias => noticias.toJSON())
        });
    }catch(err){
        console.log(err)
        return res.json({message:"error"});
    }
}