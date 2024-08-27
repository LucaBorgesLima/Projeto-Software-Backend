// Arquivo das funcoes para o banco de dados

//conexao com banco
const banco = require("./banco");

// Vai retorna todos carros cadastrados no banco de dados
const  getAll = async () =>{
    const carros = await banco.execute('SELECT * FROM CAD_CARROS');
    return carros;
};

module.exports = {
    getAll
}