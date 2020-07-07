const express = require("express");
const router = express.Router();
const usuarioController = require("@controller/usuarioController");
const pageController = require("@controller/pageController");
const auth = require("@auth/authUsuario");
const quadraController = require("@controller/quadraController");
const comentarioController = require("@controller/comentarioController");
const horarioController = require("@controller/horarioController");
const noticiaController = require("@controller/noticiaController");
const timeController = require("@controller/timeController");

//Páginas
router.get("/pagina-inicial",pageController.renderHome);
router.get("/login",pageController.renderLogin);
router.get("/cadastrar",pageController.renderCadastro);
router.get("/horarios-reservados",pageController.renderHorarios);

//Usuarios
router.post("/efetuando-login",auth.gerarToken);
router.post("/efetuando-cadastrar",usuarioController.cadastrar);
router.put("/efetuando-atualizacao-de-senha",usuarioController.editar);

//Horário
router.post("/efetuando-agendamento-de-horarios",horarioController.agendarHorario);

//Comentário
router.post("/efetuando-comentario",comentarioController.comentar);

//Quadra
router.post("/efetuando-registrar-quadra",quadraController.salvarQuadra);
router.put("/efetuando-editar-nome-da-quadra",quadraController.editarQuadra);
router.post("/efetuando-adicionar-imagens-da-quadra",quadraController.adicionarImagem);
router.delete("/efetuando-deletar-imagens-da-quadra",quadraController.deletarImagem);

//Time
router.post("/efetuando-adicionar-time",timeController.registrarTime);

//Noticia
router.post("/efetuando-postar-noticias",noticiaController.postarNoticia);

module.exports = router