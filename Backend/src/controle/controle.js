// Arquivo de controle

const model = require('../models/model');


const cadastrarClienteEVeiculo = async (req, res) => {
    
    //  Cadastrar cliente e obter o idcliente
    const clienteResult = await model.cliente(req.body);

    //  Preparar os dados do veículo, adicionando o cliente_idcliente
    const veiculoData = {
        ...req.body.veiculo,
        cliente_idcliente: clienteResult.idcliente
    };

    // Cadastrar veículo usando o idcliente
    const veiculoResult = await model.veiculo(veiculoData);

    // Retornar resposta com sucesso
        return res.status(201).json({
            message: 'Cliente e veículo cadastrados com sucesso!',
            cliente: clienteResult,
            veiculo: veiculoResult
        });
    
};

const cadastrarVaga = async (req,res) => {
    const CadVaga = await model.vaga(req.body);
    return res.status(202).json(CadVaga)

};

const statos = async (req,res) => {
    const vagaStatos = await model.statusVaga();
    return res.status(203).json(vagaStatos)
}

const addVaga = async (req,res) => {
    const add = await model.EntradaVaga(req.body);
    return res.status(204).json(add)
}

const saida = async (req,res) => {
    const sair = await model.saida(req.body);
    return res.status(205).json(sair)
}

const statusVaga = async (req,res) => {
    const vaga = await model.statu(req.body);
    return res.status(207).json(vaga)
}
const calculoTempo = async (req,res) => {
    const vaga = req.body.idvaga;
    const tempo = await model.calculo(vaga);
    return res.status(208).json(tempo)
}

module.exports = { cadastrarClienteEVeiculo,
    cadastrarVaga,
    statos,
    addVaga,
    saida,
    statusVaga,
    calculoTempo


}