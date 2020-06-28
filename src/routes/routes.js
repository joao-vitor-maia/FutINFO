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
router.put("/efetuando-atualizacao-de-senha",usuarioController.editar);

//Horário
router.post("/efetuando-agendamento-de-horarios",horarioController.agendarHorario);

//Comentário
router.post("/efetuando-comentario",comentarioController.comentar);

//Quadra
router.post("/efetuando-registrar-quadra",quadraController.salvarQuadra);
router.put("/efetuando-editar-nome-da-quadra",quadraController.editarQuadra);
router.post("/efetuando-adicionar-imagens",quadraController.adicionarImagem);

module.exports = router