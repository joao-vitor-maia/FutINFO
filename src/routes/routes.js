const express = require("express");
const router = express.Router();
const usuarioController = require("@controller/usuarioController");
const pagesController = require("@controller/pageController");
const auth = require("@auth/authUsuario");

router.post("/signup",usuarioController.cadastrar);
router.get("/home",pagesController.renderHome)
router.get("/login",auth.generateToken);

module.exports = router