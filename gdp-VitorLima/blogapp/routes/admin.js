const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")

function validarCategoria(body) {
    const erros = []

    const nome = body.nome.trim()
    const slug = body.slug.trim()


    if (!nome || typeof nome == undefined || nome == null) {
        erros.push({ texto: "Nome inválido!" })
    }

    if (!slug || typeof slug == undefined || slug == null) {
        erros.push({ texto: "Slug inválido!" })
    }

    if (nome.length < 2) {
        erros.push({ texto: "Nome da categoria muito pequeno!" })
    }

    return erros
}

router.get("/", (req, res) => {
    res.render("admin/index")
})

router.get("/posts", (req, res) => {
    res.send("Posts")
})

router.get("/categorias", (req, res) => {
    Categoria.find().lean().sort({ date: 'desc' }).then((categorias) => {
        res.render("admin/categorias", { categorias: categorias })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias!")
        res.redirect("/admin")
    })
})

router.get("/categorias/add", (req, res) => {
    res.render("admin/addcategoria")
})

router.post("/categorias/nova", (req, res) => {

    const erros = validarCategoria(req.body)

    if (erros.length > 0) {
        const mensagens = erros.map(e => e.texto).join(" | ")
        req.flash("error_msg", mensagens)
        res.redirect("/admin/categorias")
    } else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria criada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente!")
            res.redirect("/admin/categorias")
            // console.log(`Erro ao salvar categoria: ${err}`)
        })
    }

})

router.get("/categorias/edit/:id", (req, res) => {
    Categoria.findOne({ _id: req.params.id }).lean().then((categoria) => {
        res.render("admin/editcategoria", { categoria: categoria })
    }).catch((err) => {
        req.flash("error_msg", `Esta categoria não existe: ${err}`)
        res.redirect("/admin/categorias")
    })
})

router.post("/categorias/edit", (req, res) => {
    Categoria.findOne({ _id: req.body.id }).then((categoria) => {

        const erros = validarCategoria(req.body)

        if (erros.length > 0) {
            const mensagens = erros.map(e => e.texto).join(" | ")
            req.flash("error_msg", mensagens)
            res.redirect("/admin/categorias")
        } else {
            categoria.nome = req.body.nome
            categoria.slug = req.body.slug

            categoria.save().then(() => {
                req.flash("success_msg", "Categoria editada com sucesso!")
                res.redirect("/admin/categorias")
            }).catch((err) => {
                req.flash("error_msg", `Houve um erro interno ao salvar a edição da categoria: ${err}`)
                res.redirect("/admin/categorias")
            })
        }

    }).catch((err) => {
        req.flash("error_msg", `Houve um erro ao editar a categoria: ${err}`)
        res.redirect("/admin/categorias")
    })
})

router.post("/categorias/deletar", (req, res) => {
    Categoria.deleteOne({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Categoria deletada com sucesso!")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash("error_msg", `Houve um erro ao deletar categoria: ${err}`)
        res.redirect("/admin/categorias")
    })
})

module.exports = router