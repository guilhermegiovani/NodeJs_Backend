// Carregando módulos
const express = require("express")
const { engine } = require("express-handlebars")
const bodyParser = require("body-parser")
const app = express()
const admin = require("./routes/admin")
const path = require("path")
const mongoose = require("mongoose")
const session = require("express-session")
const flash = require("connect-flash")
require("./models/Postagem")
const Postagem = mongoose.model("postagens")
require("./models/Categoria")
const Categoria = mongoose.model("categorias")
const usuarios = require("./routes/usuario")
const passport = require("passport")
require("./config/auth")(passport)
require("dotenv").config();

// Configurações

// Session e passport
app.use(session({
    secret: "cursodenode",
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null
    res.locals.eAdmin = req.eAdmin
    next()
})

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Handlebars
const hbs = engine({
    defaultLayout: 'main',
    helpers: {
        ifAdmin: function(user, options) {
            if(user && user.eAdmin == 1) {
                return options.fn(this)
            } else {
                return options.inverse(this)
            }
        }
    }
})

app.engine("handlebars", hbs)
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "views"));

// Mongoose
mongoose.Promise = global.Promise

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Conectado ao MongoAtlas!")
}).catch((err) => {
    console.log(`Erro ao se conectar com o MongoAtlas: ${err}`)
})

// mongoose.connect("mongodb://localhost/blogapp").then(() => {
//     console.log("Conectado ao MongoDB!")
// }).catch((err) => {
//     console.log(`Erro ao se conectar com o MongoDB: ${err}`)
// })

// Public
app.use(express.static(path.join(__dirname, "public")))

// Rotas
app.get("/", (req, res) => {
    Postagem.find().lean().populate("categoria").sort({ data: "desc" }).then((postagens) => {
        res.render("index", { postagens: postagens })
    }).catch((err) => {
        req.flash("error_msg", `Houve um erro interno: ${err}`)
        res.redirect("/404")
    })
})

app.get("/postagem/:slug", (req, res) => {
    Postagem.findOne({ slug: req.params.slug }).lean().then((postagem) => {
        if (postagem) {
            res.render("postagem/index", { postagem: postagem })
        } else {
            req.flash("error_msg", "Esta postagem não existe!")
            res.redirect("/")
        }

    }).catch((err) => {
        req.flash("error_msg", `Houve um erro interno: ${err}`)
        res.redirect("/")
    })
})

app.get("/categorias", (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("categoria/index", { categorias: categorias })
    }).catch((err) => {
        req.flash("error_msg", `Houve um erro interno ao listar as categorias: ${err}`)
        res.redirect("/")
    })
})

app.get("/categorias/:slug", (req, res) => {
    Categoria.findOne({ slug: req.params.slug }).lean().then((categoria) => {
        if (categoria) {
            Postagem.find({ categoria: categoria._id }).lean().then((postagens) => {
                res.render("categoria/postagens", {postagens: postagens, categoria: categoria})

            }).catch((err) => {
                req.flash("error_msg", `Houve um erro ao listar os posts: ${err}`)
                res.redirect("/")
            })

        } else {
            req.flash("error_msg", "Esta categoria não existe!")
            res.redirect("/")
        }

    }).catch((err) => {
        req.flash("error_msg", `Houve um erro interno ao carregar a página desta categorias: ${err}`)
        res.redirect("/")
    })
})

app.get("/404", (req, res) => {
    res.send("Erro 404!")
})

app.use("/admin", admin)
app.use("/usuarios", usuarios)


// Outros
const PORT = process.env.PORT || 3000
// const PORT = 3000
app.listen(PORT, () => {
    console.log(`Servidor Rodando na porta ${PORT}`)
})