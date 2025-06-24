const http = require('http')
const fs = require('fs')
const port = process.env.PORT

const server = http.createServer((req, res) => {
    fs.appendFile('teste.txt', 'Curso de Node - CFB Cursos', (err) => {
        if(err) throw err
        console.log('Arquivo criado!')
        res.end()
    })
})

server.listen(port || 3000, () => {
    console.log(`Servidor rodando! http://localhost:${port || 3000}`)
})