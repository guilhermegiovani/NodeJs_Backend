// mysql2
(async () => {
    const db = require("./db")

    // Criar/Inserir cliente
    // console.log('Inserir novo cliente')
    // const nom = 'Brastorgilsan'
    // const ida = 47
    // await db.inserirCliente({nome: nom, idade: ida})

    // Atualizar cliente
    // const id = 2
    // const nom = 'Leonardo'
    // const ida = 31
    // await db.atualizarCliente(id, {nome: nom, idade: ida})
    // console.log(`Cliente ${id} atualizado!`)

    // Deletar cliente
    const id = 2
    await db.deletarCliente(id)
    console.log(`Cliente ${id} deletado!`)

    // Obter clientes
    console.log('Obter todos os clientes')
    const clientes = await db.todosClientes()
    console.log(clientes)

})()