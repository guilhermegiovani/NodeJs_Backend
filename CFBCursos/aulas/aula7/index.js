// modulos
const express = require("express")
const router = require('./rotas/rotas')
const port = process.env.PORT || 3000

const app = express()

app.use('/', router)

app.get('*', (req, res) => {
    res.send("CFB Curso!")
})

app.listen(port, () => {
    console.log(`Servidor rodando! http://localhost:${port}`)
})

// const express = require("express");
// const app = express();

// app.get("/", (req, res) => {
//   res.send("Servidor funcionando!");
// });

// app.listen(3000, () => {
//   console.log("http://localhost:3000");
// });