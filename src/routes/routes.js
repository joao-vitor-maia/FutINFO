const express = require("express");
const router = express.Router();
const multer = require("multer");
//Controllers
const usuarioController = require("@controller/usuarioController");
const pageController = require("@controller/pageController");
const auth = require("@auth/authentication");
const quadraController = require("@controller/quadraController");
const comentarioController = require("@controller/comentarioController");
const horarioController = require("@controller/horarioController");
const noticiaController = require("@controller/noticiaController");
const timeController = require("@controller/timeController");
//Middlewares
const multerConfig = require("../config/multer");

//---ROTAS---

//Auth
router.get("/autorizar",auth.autorizarUsuario);
router.post("/autorizar-afiliado",auth.autorizarAfiliado);

//Páginas 
router.get("/pagina-inicial",pageController.renderHome);
router.get("/pagina-inicial/:page",pageController.renderHome);
//Usuario
router.get("/usuario/login",pageController.renderLogin);
router.get("/usuario/cadastrar",pageController.renderCadastro);
router.get("/usuario/redefinir-senha",pageController.renderRedefinirSenha);
router.get("/usuario/ver-perfil", auth.autorizarUsuario, pageController.renderVerPerfil);
router.get("/usuario/horarios-reservados",pageController.renderHorarioUsuario);
router.get("/usuario/editar-nome", auth.autorizarUsuario, pageController.renderEditarNome);
//Afiliado
router.get("/afiliado/registrar-quadra", auth.autorizarAfiliado, pageController.renderRegistrarQuadra);
router.get("/afiliado/editar-quadra", auth.autorizarAfiliado, pageController.renderEditarQuadra);
router.get("/afiliado/adicionar-imagens", auth.autorizarAfiliado, pageController.renderAdicionarImagens);
router.get("/afiliado/deletar-imagens", auth.autorizarAfiliado, pageController.renderDeletarImagens);
router.get("/afiliado/horarios-solicitados", auth.autorizarAfiliado, pageController.renderHorarioSolicitado);
router.get("/afiliado/historico-horarios", auth.autorizarAfiliado, pageController.renderAfiliadoHistorico);
router.get("/afiliado/historico-horarios/:page", auth.autorizarAfiliado, pageController.renderAfiliadoHistorico);
router.get("/afiliado/ver-quadra", auth.autorizarAfiliado, pageController.renderVerQuadra);

//Usuarios
router.post("/efetuando-login",auth.gerarToken);
router.get("/efetuando-logout",auth.logout);
router.post("/efetuando-cadastrar",usuarioController.cadastrar);
router.post("/efetuando-editar-nome",usuarioController.editarNome);
router.post("/efetuando-atualizacao-de-senha",usuarioController.redefinirSenha);

//Horário
router.post("/efetuando-agendamento-de-horarios",horarioController.agendarHorario);
router.post("/efetuando-aprovar-horario",horarioController.aprovar);
router.post("/efetuando-recusar-horario",horarioController.recusar);

//Comentário
router.post("/efetuando-comentario",comentarioController.comentar);

//Quadra
router.post("/efetuando-registrar-quadra",quadraController.salvarQuadra);
router.post("/efetuando-editar-quadra",quadraController.editarQuadra);
router.post("/efetuando-adicionar-imagens-da-quadra",auth.autenticarAdicionarImagens,multer(multerConfig).array("file"),quadraController.adicionarImagem);
router.post("/efetuando-deletar-imagens-da-quadra",quadraController.deletarImagem);

//Time
router.post("/efetuando-adicionar-time",timeController.registrarTime);

//Noticia
router.post("/efetuando-postar-noticias",noticiaController.postarNoticia);

module.exports = router