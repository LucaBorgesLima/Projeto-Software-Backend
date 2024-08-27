// Arquivo de Funcoes que vai nas rotas

const model = require('../models/model');

//funcao : mostra todos os carros cadastrados 
const getCadastro_carros = async (req,res) => {

    const cadastros  = await model.getAll();
    return res.status(200).json(cadastros);
}

module.exports = {
    getCadastro_carros,
}