const Sequelize = require("sequelize")
const sequelize = new Sequelize('test', 'root', '0305091011', {
    host: "localhost",
    dialect: "mysql"
})

sequelize.authenticate().then(function() {
    console.log("Conectado com sucesso!")
}).catch(function(erro) {
    console.log(`Falha ao se conectar ${erro}`)
})

// Postagem
const Postagem = sequelize.define('postagens', {
    titulo: {
        type: Sequelize.STRING
    },
    conteudo: {
        type: Sequelize.TEXT
    }
})

// Postagem.sync({force: true})
// Postagem.create({
//     titulo: "Um titulo qualquer",
//     conteudo: "tghdjetrhewfjbsiwgtuiehgtvanflnvksfwioughoeifhcnjvboifherbgvisevi"
// })

// Usuários
const Usuario = sequelize.define("usuarios", {
    nome: {
        type: Sequelize.STRING
    },
    sobrenome: {
        type: Sequelize.STRING
    },
    idade: {
        type: Sequelize.INTEGER
    },
    email: {
        type: Sequelize.STRING
    }
})

// Usuario.sync({force: true})
// Usuario.create({
//     nome: "Guilherme",
//     sobrenome: "Nobre",
//     idade: 23,
//     email: "teste@email.com"
// })