
const http = require('http')
const port = process.env.PORT

const server = http.createServer((req, res) => {
    res.statusCode = 200
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end('CFB Cruso')
})

server.listen(port || 3000, () => {
    console.log(`Servidor rodando! http://localhost:${port || 3000}`)
})