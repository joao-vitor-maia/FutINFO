const express = require("express");
const app = express();
const mongoose = require("mongoose");
const handlebars = require("express-handlebars");
require("dotenv").config();
require("module-alias/register");

const routes = require('@routes');

//Handlebars
app.engine("handlebars",handlebars({defaultLayout:'main'}));
app.set("view engine","handlebars");

//Rotas
app.use("/",routes)

//Conectando banco de dados 
mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://"+process.env.DB_USER+":"+process.env.DB_PASSWORD+"@futinfo-2z6la.mongodb.net/dbfutinfo?retryWrites=true&w=majority",{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(() => {
    console.log("Conexão com o banco sucedida...")
}).catch(err => {
    console.log("Erro ao conectar com o banco: "+err)
});

app.listen(process.env.PORT, () => {
    console.log("Conexão com servidor sucedida na porta: "+process.env.PORT);
});