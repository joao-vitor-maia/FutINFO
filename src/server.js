const express = require("express");
const app = express();
const mongoose = require("mongoose");
const paginate = require("handlebars-paginate");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
require("module-alias/register");

const routes = require('@routes');

//Handlebars
app.engine("handlebars", handlebars({
    defaultLayout: 'main',
    helpers: {
        paginate: paginate
    }
}));
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "handlebars");

//Body-Parser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json({
    limit: '50mb',
    extended: true
}));

//Rotas
app.use("/", routes);

//Public
app.use('/', express.static(path.join(__dirname, 'Assets')));

//Conectando banco de dados 
mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASSWORD + "@futinfo-2z6la.mongodb.net/dbfutinfo?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Conexão com o banco sucedida...")
}).catch(err => {
    console.log("Erro ao conectar com o banco: " + err)
});

app.listen(process.env.PORT, () => {
    console.log("Conexão com servidor sucedida...");
});