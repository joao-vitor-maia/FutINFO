const express = require("express");
const router = express.Router();
const usuarioController = require("@controller/usuarioController");
const pageController = require("@controller/pageController");
const auth = require("@auth/authUsuario");
const quadraController = require("@controller/quadraController");
const comentarioController = require("@controller/comentarioController");
const horarioController = require("@controller/horarioController");

//Estáticas
router.get("/pagina-inicial",pageController.renderHome);

//Usuarios
router.get("/efetuando-login",auth.gerarToken);
router.post("/efetuando-cadastrar",usuarioController.cadastrar);
router.post("/efetuando-comentario",comentarioController.comentar);
router.post("/efetuando-agendamento-de-horarios",horarioController.agendarHorario);

//Quadra
router.post("/efetuando-registrar-quadra",quadraController.salvarQuadra);

module.exports = router