const express = require("express");
const router = express.Router();
const usuarioController = require("@controller/usuarioController");
const pageController = require("@controller/pageController");
const auth = require("@auth/authUsuario");
const quadraController = require("@controller/quadraController");

router.get("/pagina-inicial",pageController.renderHome);

router.post("/efetuando-cadastrar",usuarioController.cadastrar);
router.get("/efetuando-login",auth.gerarToken);
router.post("/efetuando-registrar-quadra",quadraController.salvarQuadra);
router.post("/efetuando-comentario",usuarioController.comentar);

module.exports = router