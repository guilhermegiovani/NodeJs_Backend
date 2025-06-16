const mongoose = require('mongoose')

// Configurando o mongoose
mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost/aprendendo", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB Conectado...")
}).catch((err) => {
    console.log(`Houve um erro ao se conectar ao mongoDB: ${err}`)
})

// Model - Usuários
// Definindo Mobel
const UsuarioSchema = mongoose.Schema({
    nome: {
        type: String,
        require: true
    },
    sobrenome: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    idade: {
        type: Number,
        require: true
    },
    pais: {
        type: String
    }

})

// Collection
mongoose.model('usuarios', UsuarioSchema)

const newUser = mongoose.model('usuarios')
// new newUser({
//     nome: "Jhon",
//     sobrenome: "Doe",
//     email: "teste@gmail.com",
//     idade: 47,
//     pais: "Suiça"
// }).save().then(() => {
//     console.log("Usuário criado com sucesso!")
// }).catch((err) => {
//     console.log(`Houve um erro ao cadastrar o usuário: ${err}`)
// })