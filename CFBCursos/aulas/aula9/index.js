// eventos com node
const http = require('http')
const events = require('events')
const EventEmissor = new events.EventEmitter()

const final = () => {
    console.log('Fim do processo!')
}

EventEmissor.on('msg', () => {
    console.log('Curso de node')
})

EventEmissor.on('fim', final)

const port = process.env.PORT || 3000
const retorno = () => {
    console.log(`Servidor rodando! http://localhost:${port}`)
}

const server = http.createServer((req, res) => {
    EventEmissor.emit('msg')
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.write('CFB Cursos')
    EventEmissor.emit('fim')
    res.end()
})

server.listen(port, retorno)