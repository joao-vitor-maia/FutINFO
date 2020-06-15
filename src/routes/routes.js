const express = require("express");
const router = express.Router();
const usuarioController = require("@controller/usuariosController");


router.post("/cadastrarUsuario",usuarioController.cadastrar);
router.get("/gerarToken", (dados,req,res) => {
    console.log(new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"}).valueOf())
})
router.get("/Home",(req,res) => {
    res.render("pages/index.handlebars");
})

module.exports = router