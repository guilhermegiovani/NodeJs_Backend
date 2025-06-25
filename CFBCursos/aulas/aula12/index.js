// upload de arquivo com formidable
const http = require('http')
const port = process.env.PORT || 3000
const formidable = require('formidable')
const fs = require('fs')

const server = http.createServer((req, res) => {

    if(req.url == '/envioDeArquivo') {
        const form = new formidable.IncomingForm()
        form.parse(req, (erro, campos, arquivos) => {
            const urlAntiga = arquivos.fileToUpload[0].filepath
            const urlNova = `D:/Guilherme/${arquivos.fileToUpload[0].originalFilename}`

            fs.copyFile(urlAntiga, urlNova, (erro) => {
                if(erro) throw erro
                res.write('Arquivo movido')
                res.end()
            })
        })

    } else {
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write('<form action="envioDeArquivo" method="post" enctype="multipart/form-data">')
        res.write('<input type="file" name="fileToUpload"><br>')
        res.write('<input type="submit" value="Enviar">')
        res.write('</form>')
        return res.end()
    }

})

server.listen(port, () => {
    console.log(`Servidor rodando! http://localhost:${port}`)
})