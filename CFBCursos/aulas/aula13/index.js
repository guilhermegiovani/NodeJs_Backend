// mongodb atlas
const { MongoClient } = require("mongodb")
const url = "mongodb+srv://dbCFBCursos:dbcfbcursos1234@cluster0.gtkqv6g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const client = new MongoClient(url)

console.log("conectando...")

async function conectar() {
    try {
        console.log("Conectando ao Mongo...")
        await client.connect()

        const dbo = client.db('cfbcursos')
        const colecao = dbo.collection("cursos")

        // const novoCurso = {
        //     curso: "Curso de HTML e CSS",
        //     canal: "Udemy"
        // }

        // Inserir um dado no banco
        // await colecao.insertOne(novoCurso)
        // console.log("Curso inserido com sucesso!")
        //-----------------------------------------------------------------

        // Inserir vários dados no banco e contar a quantidade inserida
        // const novosCursos = [
        //     {
        //         curso: "Curso de HTML e CSS",
        //         canal: "Udemy"
        //     },
        //     {
        //         curso: "Curso de JavaScript",
        //         canal: "CFB Cursos"
        //     },
        //     {
        //         curso: "Curso de TypeScript",
        //         canal: "CFB Cursos"
        //     },
        //     {
        //         curso: "Curso de C#",
        //         canal: "CFB Cursos"
        //     },
        // ]
   
        // const resultado = await colecao.insertMany(novosCursos)
        // console.log(`${resultado.insertedCount} novos cursos inseridos!`)
        //--------------------------------------------------------------------

        // Buscar/Pegar dados do banco
        // const resultado = await colecao.find({canal: 'CFB Cursos'}, {projection: {_id: 0}}).toArray()
        // console.log(`Curso encontrado:`)
        // console.log(resultado[0])
        //-----------------------------------------------------------------------

        // Buscar/Pegar dados com query e regex
        // const query = {}
        // const resultado = await colecao.find(query, {projection: {_id: 0}}).toArray()
        // console.log(`Curso encontrado:`)
        // console.log(resultado)
        //------------------------------------------------------------------------------
        
        // Ordenar dados com o sort()
        // const ordenacao = {curso: -1}
        // const query = {}
        // const resultado = await colecao.find(query).sort(ordenacao).toArray()
        // console.log(`Curso encontrado:`)
        // console.log(resultado)
        //-------------------------------------------------------------------------------

        // Deletar um objeto da coleção
        // const query = {curso: 'Curso de TypeScript'}

        // const resultado = await colecao.deleteOne(query)
        // console.log(`Curso deletado:`)
        // console.log(resultado)
        //------------------------------------------------------------------

        // Deletar vários objetos e contar a quantidade deletada
        // let query = {curso: /.t/}

        // let resultado = await colecao.deleteMany(query)
        // console.log(`${resultado.deletedCount} curso(s) deletado(s)`)

        // query = {}
        // resultado = await colecao.find(query, {projection: {_id: 0}}).toArray()
        // console.log(`Curso encontrado:`)
        // console.log(resultado)
        //---------------------------------------------------------------------

        // Atualização de dados
        let query = {curso: 'Curso de JavaScript'}
        const novoObj = {$set: {curso: 'Curso de JavaScript 2025'}}

        // Atualizar um dado
        // let resultado = await colecao.updateOne(query, novoObj)
        // console.log(`Curso atualizado:`)
        // console.log(resultado)

        // query = {}
        // resultado = await colecao.find(query, {projection: {_id: 0}}).toArray()
        // console.log(`Curso encontrado:`)
        // console.log(resultado)
        //-----------------------------------------------

        // Atualizar vários dados
        let resultado = await colecao.updateMany(query, novoObj)
        console.log(`${resultado.modifiedCount} curso(s) atualizado(s)`)

        query = {}
        resultado = await colecao.find(query, {projection: {_id: 0}}).toArray()
        console.log(`Cursos encontrados:`)
        console.log(resultado)

    } catch (erro) {
        console.log(`Erro ao conectar ou inserir: ${erro}`)
    } finally {
        await client.close()
        console.log("Conexão encerrada!")
    }
}

conectar()

// mongodb.connect(url, (erro, banco) => {
//     console.log("Tentando conectar...");
//     if (erro) throw erro

//     console.log("Conectado com sucesso");

//     const dbo = banco.db('cfbcursos')
//     const obj = {
//         curso: "Curso de Node",
//         canal: "CFB Cursos"
//     }

//     const colecao = "cursos"
//     dbo.collection(colecao).insertOne(obj, (erro, res) => {
//         if (erro) throw erro
//         console.log("1 novo curso inserido")
//         banco.close()
//     })
// })