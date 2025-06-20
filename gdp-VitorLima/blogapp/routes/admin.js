const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
require("../models/Postagem")
const Postagem = mongoose.model("postagens")
const {eAdmin} = require("../helpers/eAdmin")

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

function validarPostagem(body) {
    const erros = []

    const titulo = body.titulo.trim()
    const slug = body.slug.trim()
    const descricao = body.descricao.trim()
    const conteudo = body.conteudo.trim()
    const categoria = body.categoria


    if (!titulo || typeof titulo == undefined || titulo == null) {
        erros.push({ texto: "Nome inválido!" })
    }

    if (!slug || typeof slug == undefined || slug == null) {
        erros.push({ texto: "Slug inválido!" })
    }

    if (!descricao || typeof descricao == undefined || descricao == null) {
        erros.push({ texto: "Descrição inválido!" })
    }

    if (!conteudo || typeof conteudo == undefined || conteudo == null) {
        erros.push({ texto: "Conteúdo inválido!" })
    }

    if (categoria == "0") {
        erros.push({ texto: "Categoria inválida, registre uma categoria!" })
    }

    if (titulo.length < 2 && titulo.length > 0) {
        erros.push({ texto: "Título da postagem muito pequeno!" })
    }

    return erros
}

router.get("/", eAdmin, (req, res) => {
    res.render("admin/index")
})

router.get("/posts", eAdmin, (req, res) => {
    res.send("Página de posts")
})

router.get("/categorias", eAdmin, (req, res) => {
    Categoria.find().lean().sort({ date: 'desc' }).then((categorias) => {
        res.render("admin/categorias", { categorias: categorias })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias!")
        res.redirect("/admin")
    })
})

router.get("/categorias/add", eAdmin, (req, res) => {
    res.render("admin/addcategoria")
})

router.post("/categorias/nova", eAdmin, (req, res) => {

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

router.get("/categorias/edit/:id", eAdmin, (req, res) => {
    Categoria.findOne({ _id: req.params.id }).lean().then((categoria) => {
        res.render("admin/editcategoria", { categoria: categoria })
    }).catch((err) => {
        req.flash("error_msg", `Esta categoria não existe: ${err}`)
        res.redirect("/admin/categorias")
    })
})

router.post("/categorias/edit", eAdmin, (req, res) => {
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

router.post("/categorias/deletar", eAdmin, (req, res) => {
    Categoria.deleteOne({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Categoria deletada com sucesso!")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash("error_msg", `Houve um erro ao deletar categoria: ${err}`)
        res.redirect("/admin/categorias")
    })
})

router.get("/postagens", eAdmin, (req, res) => {

    Postagem.find().lean().populate("categoria").sort({ data: "desc" }).then((postagens) => {
        res.render("admin/postagens", { postagens: postagens })

    }).catch((err) => {
        req.flash("error_msg", `Houve um erro ao listar as postagens: ${err}`)
        res.redirect("/admin")
    })

})

router.get("/postagens/add", eAdmin, (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("admin/addpostagem", { categorias: categorias })
    }).catch((err) => {
        req.flash("error_msg", `Houve um erro ao carregar formulário: ${err}`)
        res.redirect("/admin")
    })
})

router.post("/postagens/nova", eAdmin, (req, res) => {
    const erros = validarPostagem(req.body)

    // if(req.body.categoria == "0") {
    //     erros.push({texto: "Categoria inválida, registre uma categoria!"})
    // }

    if (erros.length > 0) {
        const mensagens = erros.map(e => e.texto).join(" | ")
        req.flash("error_msg", mensagens)
        res.redirect("/admin/postagens")
    } else {
        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        }

        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "Postagem criada com sucesso!")
            res.redirect("/admin/postagens")
        }).catch((err) => {
            req.flash("error_msg", `Houve um erro durante o salvamento da postagem: ${err}`)
            res.redirect("/admin/postagens")
        })
    }

})

router.get("/postagens/edit/:id", eAdmin, (req, res) => {

    Postagem.findOne({ _id: req.params.id }).lean().then((postagem) => {

        Categoria.find().lean().then((categorias) => {
            res.render("admin/editpostagem", { categorias: categorias, postagem: postagem })
        }).catch((err) => {
            req.flash("error_msg", `Houve um erro ao listar a categoria: ${err}`)
            res.redirect("/admin/postagens")
        })

    }).catch((err) => {
        req.flash("error_msg", `Houve um erro ao editar a postagem: ${err}`)
        res.redirect("/admin/postagens")
    })

})

router.post("/postagem/edit", eAdmin, (req, res) => {
    const erros = validarPostagem(req.body)

    if (erros.length > 0) {
        const mensagens = erros.map(e => e.texto).join(" | ")
        req.flash("error_msg", mensagens)
        res.redirect("/admin/postagens")
    } else {
        Postagem.findOne({ _id: req.body.id }).then((postagem) => {
            postagem.titulo = req.body.titulo
            postagem.slug = req.body.slug
            postagem.descricao = req.body.descricao
            postagem.conteudo = req.body.conteudo
            postagem.categoria = req.body.categoria

            postagem.save().then(() => {
                req.flash("success_msg", "Edição da postagem salva com sucesso!")
                res.redirect("/admin/postagens")
            }).catch((err) => {
                req.flash("error_msg", `Houve um erro ao salvar a edição da postagem: ${err}`)
                res.redirect("/admin/postagens")
            })

        }).catch((err) => {
            req.flash("error_msg", `Houve um erro ao finalizar a edição da postagem: ${err}`)
            res.redirect("/admin/postagens")
        })

    }


})

router.get("/postagens/deletar/:id", eAdmin, (req, res) => {
    Postagem.deleteOne({ _id: req.params.id }).then(() => {
        req.flash("success_msg", "Postagem deletada com sucesso!")
        res.redirect("/admin/postagens")
    }).catch((err) => {
        req.flash("error_msg", `Houve um erro ao deletar a postagem: ${err}`)
        res.redirect("/admin/postagens")
    })
})

module.exports = router