const express = require('express')
const router = express.Router()

let cursosInfo = [
    {
        'curso': 'node',
        'info': 'Curso de Node'
    },
    {
        'curso': 'react',
        'info': 'Curso de React'
    },
    {
        'curso': 'java',
        'info': 'Curso de Java'
    },
    {
        'curso': 'arduino',
        'info': 'Curso de Arduino'
    },
]

router.get('/', (req, res) => {
    res.json({ola: 'Seja bem vindo!'})
})

router.get('/:cursoid', (req, res) => {
    const curso = req.params.cursoid.toLowerCase()
    let cursoI = cursosInfo.find(i => i.curso === curso)
    if(!cursoI) {
        res.status(404).json(
            {erro: 'Curso não encontrado', cursoPesquisado: curso}
        )
    } else {
        res.status(200).json(cursoI)
    }
})

module.exports = router