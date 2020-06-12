const express = require("express");
const router = express.Router();
const logs = require("@middlewares/sendError")

router.get('/',logs,(req,res) => {
    res.send("Teste");
})

module.exports = router