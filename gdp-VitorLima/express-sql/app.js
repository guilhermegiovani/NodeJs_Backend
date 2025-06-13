// App Postagens

const express = require("express")
const app = express()
const { engine } = require("express-handlebars")
const Sequelize = require("sequelize")

// Config
    // Template Engine
        app.engine('handlebars', engine({ defaultLayout: "main" }))
        app.set("view engine", "handlebars")
    // Conexão com o banco de dados MySql
        const sequelize = new Sequelize('test', 'root', '0305091011', {
            host: "localhost",
            dialect: "mysql"
        })
// Rotas
    app.get("/cad", function(req, res) {
        res.render('form')
    })



app.listen(8081, function () {
    console.log("Servidor rodando na url http://localhost:8081")
})



// Aula teste express/sql

// const express = require("express")
// const app = express()

// app.get("/", function(req, res) {
//     res.sendFile(`${__dirname}/html/index.html`)
// })

// app.get("/sobre", function(req, res) {
//     res.sendFile(`${__dirname}/html/sobre.html`)
// })

// app.get("/blog", function(req, res) {
//     res.send("Bem-vindo ao meu blog")
// })

// app.get("/ola/:nome/:cargo", function(req, res) {
//     res.send(`<h1>Ola ${req.params.nome}</h1> <h2>Seu cargo é: ${req.params.cargo}</h2>`)
// })


// app.listen(8081, function() {
//     console.log("Servidor rodando na url http://localhost:8081")
// })