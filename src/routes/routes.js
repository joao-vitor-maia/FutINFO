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
const artilheiroController = require("@controller/artilheiroController");
const resultadoJogoController = require("@controller/resultadoJogoController");
//Middlewares
const multerConfig = require("../config/multer");

//---ROTAS---

//Auth
router.get("/autorizar",auth.autorizarUsuario);
router.post("/autorizar-afiliado",auth.autorizarAfiliado);

//Páginas 
router.get("/pagina-inicial",pageController.renderHome);
router.get("/quadras",pageController.renderQuadra);
router.get("/classificacao-e-artilheiros",pageController.renderClassificacaoEArtilheiro);
router.get("/classificacao-e-artilheiros/Masculino-Campo",pageController.renderClassificacaoEArtilheiroMasculinoCampo);
router.get("/classificacao-e-artilheiros/Masculino-Futsal",pageController.renderClassificacaoEArtilheiroMasculinoFutsal);
router.get("/classificacao-e-artilheiros/Feminino-Campo",pageController.renderClassificacaoEArtilheiroFemininoCampo);
router.get("/classificacao-e-artilheiros/Feminino-Futsal",pageController.renderClassificacaoEArtilheiroFemininoFutsal);

router.get("/classificacao-e-artilheiros/:page",pageController.renderClassificacaoEArtilheiro);
router.get("/classificacao-e-artilheiros/Masculino-Campo/:page",pageController.renderClassificacaoEArtilheiroMasculinoCampo);
router.get("/classificacao-e-artilheiros/Masculino-Futsal/:page",pageController.renderClassificacaoEArtilheiroMasculinoFutsal);
router.get("/classificacao-e-artilheiros/Feminino-Campo/:page",pageController.renderClassificacaoEArtilheiroFemininoCampo);
router.get("/classificacao-e-artilheiros/Feminino-Futsal/:page",pageController.renderClassificacaoEArtilheiroFemininoFutsal);
router.get("/pagina-inicial/:page",pageController.renderHome);

//Páginas Usuario
router.get("/usuario/login", pageController.renderLogin);
router.get("/usuario/cadastrar", pageController.renderCadastro);
router.get("/usuario/redefinir-senha", pageController.renderRedefinirSenha);
router.get("/usuario/ver-perfil", auth.autorizarUsuario, pageController.renderVerPerfil);
router.get("/usuario/horarios-reservados", auth.autorizarUsuario, pageController.renderHorarioUsuario);
router.get("/usuario/editar-nome", auth.autorizarUsuario, pageController.renderEditarNome);
router.get("/usuario/editar-email", auth.autorizarUsuario, pageController.renderEditarEmail);
router.get("/usuario/editar-senha", auth.autorizarUsuario, pageController.renderEditarSenha);
router.get("/usuario/editar-telefone", auth.autorizarUsuario, pageController.renderEditarTelefone);
//Páginas Afiliado
router.get("/afiliado/registrar-quadra", auth.autorizarAfiliado, pageController.renderRegistrarQuadra);
router.get("/afiliado/editar-quadra", auth.autorizarAfiliado, pageController.renderEditarQuadra);
router.get("/afiliado/adicionar-imagens", auth.autorizarAfiliado, pageController.renderAdicionarImagens);
router.get("/afiliado/deletar-imagens", auth.autorizarAfiliado, pageController.renderDeletarImagens);
router.get("/afiliado/horarios-solicitados", auth.autorizarAfiliado, pageController.renderHorarioSolicitado);
router.get("/afiliado/historico-horarios", auth.autorizarAfiliado, pageController.renderAfiliadoHistorico);
router.get("/afiliado/historico-horarios/:page", auth.autorizarAfiliado, pageController.renderAfiliadoHistorico);
router.get("/afiliado/ver-quadra", auth.autorizarAfiliado, pageController.renderVerQuadra);
router.get("/afiliado/registrar-preco", auth.autorizarAfiliado, pageController.renderRegistrarPreco);
router.get("/afiliado/adicionar-horarios-disponiveis", auth.autorizarAfiliado, pageController.renderAdicionarHorarioDisponivel);
router.get("/afiliado/adicionar-modalidade", auth.autorizarAfiliado, pageController.renderAdicionarModalidade);
//Páginas Admin
router.get("/admin/adicionar-noticia", auth.autorizarAdmin, pageController.renderAdicionarNoticia);
router.get("/admin/adicionar-classificacao", auth.autorizarAdmin, pageController.renderAdicionarTime);
router.get("/admin/adicionar-artilheiro", auth.autorizarAdmin, pageController.renderAdicionarArtilheiro);
router.get("/admin/adicionar-afiliado", auth.autorizarAdmin, pageController.renderAdicionarAfiliado);
router.get("/admin/adicionar-resultado-jogo", auth.autorizarAdmin, pageController.renderAdicionarResultadoJogo);
router.get("/admin/editar-noticia/:noticiaId", auth.autorizarAdmin, pageController.renderEditarNoticia);
router.get("/admin/editar-classificacao/:timeId", auth.autorizarAdmin, pageController.renderEditarTime);
router.get("/admin/editar-artilheiro/:artilheiroId", auth.autorizarAdmin, pageController.renderEditarArtilheiro);
router.get("/admin/editar-resultado-jogo/:resultadoJogoId", auth.autorizarAdmin, pageController.renderEditarResultadoJogo);

//Api Usuarios
router.post("/efetuando-login",auth.gerarToken);
router.get("/efetuando-logout",auth.logout);
router.post("/efetuando-cadastrar",usuarioController.cadastrar);
router.post("/efetuando-editar-nome",usuarioController.editarNome);
router.post("/efetuando-editar-email",usuarioController.editarEmail);
router.post("/efetuando-editar-senha",usuarioController.editarSenha);
router.post("/efetuando-editar-telefone",usuarioController.editarTelefone);
router.post("/efetuando-atualizacao-de-senha",usuarioController.redefinirSenha);
router.post("/efetuando-adicionar-afiliado", auth.autorizarAdmin, usuarioController.adicionarAfiliado);

//Api Horário
router.post("/efetuando-agendamento-de-horarios",horarioController.agendarHorario);
router.post("/efetuando-adicionar-horario-disponivel",horarioController.adicionarHorarioDisponivel);
router.post("/efetuando-aprovar-horario",horarioController.aprovar);
router.post("/efetuando-recusar-horario",horarioController.recusar);

//Api Comentário
router.post("/efetuando-comentario",comentarioController.comentar);

//Api Quadra
router.post("/efetuando-registrar-quadra",quadraController.salvarQuadra);
router.post("/efetuando-registrar-preco",quadraController.salvarPreco);
router.post("/efetuando-editar-quadra",quadraController.editarQuadra);
router.post("/efetuando-adicionar-imagens-da-quadra",multer(multerConfig).array("file"),quadraController.adicionarImagem);
router.post("/efetuando-deletar-imagens-da-quadra",quadraController.deletarImagem);
router.post("/efetuando-adicionar-modalidade",quadraController.adicionarModalidade);

//Api Time
router.post("/efetuando-adicionar-time",timeController.registrarTime);
router.post("/efetuando-editar-time",timeController.editarTime);

//Api ResultadoJogo
router.post("/efetuando-adicionar-resultado-jogo",resultadoJogoController.adicionarResultadoJogo);
router.post("/efetuando-editar-resultado-jogo",resultadoJogoController.editarResultadoJogo);

//Api Artilheiro
router.post("/efetuando-adicionar-artilheiro",artilheiroController.registrarArtilheiro);
router.post("/efetuando-editar-artilheiro",artilheiroController.editarArtilheiro);

//Api Noticia
router.post("/efetuando-postar-noticias",multer(multerConfig).single("file"),noticiaController.postarNoticia);
router.post("/efetuando-editar-noticias",multer(multerConfig).single("file"),noticiaController.editarNoticia);

module.exports = router