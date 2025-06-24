const express = require('express')
const app = express()

const port = process.env.PORT

app.get('/', (req, res) => {
    res.send('Seja Bem-vindo!')
})

app.get('/canal', (req, res) => {
    res.json({canal: "CFB Cursos"})
})

app.listen(port || 3000, () => {
    console.log(`Servidor rodando! http://localhost:${port || 3000}`)
})