// App Postagens

const express = require("express")
const app = express()
const { engine } = require("express-handlebars")
const bodyParser = require("body-parser")
const Post = require("./models/Post")
const { where } = require("sequelize")


// Config
    // Template Engine
        app.engine('handlebars', engine({ defaultLayout: "main" }))
        app.set("view engine", "handlebars")
    // Body Parser
        app.use(bodyParser.urlencoded({extended: false}))
        app.use(bodyParser.json())
    
// Rotas
    app.get("/", (req, res) => {
        Post.findAll({order: [['id', 'DESC']]}).then((posts) => {
            res.render("home", {posts : posts.map(post => post.toJSON())})
        })
    })

    app.get("/cad", (req, res) => {
        res.render('form')
    })

    app.post("/addPostagem", (req, res) => {

        Post.create({
            titulo: req.body.titulo,
            conteudo: req.body.conteudo
        }).then(() => {
            res.redirect("/")
        }).catch((erro) => {
            res.send(`Houve um erro: ${erro}`)
        })

    })

    app.get("/deletar/:id", (req, res) => {
        Post.destroy({where: {'id': req.params.id}}).then(() => {
            res.send("Postagem deletada com sucesso!")
        }).catch((erro) => {
            res.send("Esta postagem não existe!")
        })
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