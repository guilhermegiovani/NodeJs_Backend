const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
const bcrypt = require("bcryptjs")
const passport = require("passport")
const eAdmin = require("../helpers/eAdmin")

function validarUsuario(body) {
    const erros = []

    const nome = body.nome
    const email = body.eamil
    const senha = body.senha
    const senha2 = body.senha2

    if (nome || typeof nome == undefined || nome == null) {
        erros.push({ texto: "Nome inválido!" })
    }

    if (email || typeof email == undefined || email == null) {
        erros.push({ texto: "Email inválido!" })
    }

    if (senha || typeof senha == undefined || senha == null) {
        erros.push({ texto: "Senha inválido!" })
    }

    if (senha.length < 4 && senha.length > 0) {
        erros.push({ texto: "Senha muito curta!" })
    }

    if (senha != senha2) {
        erros.push({ texto: "As senhas são diferentes, tente novamente!" })
    }

    return erros
}

router.get("/registro", (req, res) => {
    res.render("usuarios/registro")
})

router.post("/registro", (req, res) => {
    // const erros = validarUsuario(req.body)
    const erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: "Nome inválido!" })
    }

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({ texto: "Email inválido!" })
    }

    if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        erros.push({ texto: "Senha inválido!" })
    }

    if (req.body.senha.length < 4 && req.body.senha.length > 0) {
        erros.push({ texto: "Senha muito curta!" })
    }

    if (req.body.senha != req.body.senha2) {
        erros.push({ texto: "As senhas são diferentes, tente novamente!" })
    }

    if (erros.length > 0) {
        // const mensagemErro = erros.map((e) => e.texto).join(" | ")
        res.render("usuarios/registro", { erros: erros })
    } else {
        Usuario.findOne({ email: req.body.email }).then((usuario) => {
            if (usuario) {
                req.flash("error_msg", "Já existe uma conta com esse e-mail no nosso sistema!")
                res.redirect("/usuarios/registro")
            } else {
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if (erro) {
                            req.flash("error_msg", `Houve um erro durante o salvamento do usuário: ${err}`)
                            res.redirect("/")
                        }

                        novoUsuario.senha = hash
                        novoUsuario.save().then(() => {
                            req.flash("success_msg", "Usuário criado com sucesso!")
                            res.redirect("/")

                        }).catch((err) => {
                            req.flash("error_msg", `Houve um erro ao criar o usuário, tente novamente!: ${err}`)
                            res.redirect("/usuarios/registro")

                        })

                    })

                })

            }

        }).catch((err) => {
            req.flash("error_msg", `Houve um erro interno: ${err}`)
            res.redirect("/")
        })
    }

})

router.get("/login", (req, res) => {
    res.render("usuarios/login")
})

router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/usuarios/login",
        failureFlash: true

    })(req, res, next)

})

router.get("/logout", (req, res) => {
    req.logout((err) => {
        if(err) {
            req.flash("error_msg", `Erro ao deslogar: ${err}`)
            res.redirect("/")
            return next()
        }

        req.flash("success_msg", "Deslogado com sucesso!")
        res.redirect("/")
    })
})


module.exports = router