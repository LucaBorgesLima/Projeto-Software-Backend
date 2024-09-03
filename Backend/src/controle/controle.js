// Arquivo de rotas

const model = require('../models/model');

//rota: mostra todos os donos e carros cadastrados que esta no banco de dados
const getCadastro_carros = async (req,res) => {

    const cadastros  = await model.Verdados();
    return res.status(200).json(cadastros);
}

// rota : para cadastrar carros no banco de dados 
const Postcadastro_carro = async (req,res) => {
    const resultado = await model.cadastro(req.body);
    return res.status(201).json(resultado)
}

// rota : para cadastrar cliente no banco de dados 
const cadastrar_cliente = async (req,res) => {
    const cliente = await model.cadastro_cliente(req.body);
    return res.status(202).json(cliente)
}

module.exports = {
    getCadastro_carros,
    Postcadastro_carro,
    cadastrar_cliente
}