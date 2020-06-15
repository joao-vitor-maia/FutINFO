const express = require("express");
const router = express.Router();
const usuarioController = require("@controller/usuariosController");
const pagesController = require("@controller/pagesController");

router.post("/cadastrarUsuario",usuarioController.cadastrar);
router.get("/home",pagesController.renderHome)

module.exports = router