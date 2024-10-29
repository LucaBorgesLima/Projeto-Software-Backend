// Arquivo de controle

const model = require('../models/model');


const cadastrarClienteEVeiculo = async (req, res) => {
    console.log(req.body)
    
    //  Cadastrar cliente e obter o idcliente
    const clienteResult = await model.cliente(req.body);

    //  Preparar os dados do veículo, adicionando o cliente_idcliente
    const veiculoData = {
        ...req.body.veiculo,
        cliente_idcliente: clienteResult.idcliente
    };

    // Cadastrar veículo usando o idcliente
    const veiculoResult = await model.veiculo(veiculoData);
    console.log(veiculoResult)

    // Retornar resposta com sucesso
        return res.status(201).json({
            cliente: clienteResult,
            veiculo: veiculoResult
        });
    
};  

const cadastrarVaga = async (req,res) => {
    const CadVaga = await model.vaga(req.body);
    console.log(CadVaga)
    return res.status(201).json({  
        Cadastrar:CadVaga
    });

};
    

const addVaga = async (req,res) => {
    const add = await model.EntradaVaga(req.body);
    console.log(add)
    return res.status(201).json({
        Vaga:add
    });     

    
}

const saida = async (req,res) => {
    const sair = await model.saida(req.body);
    return res.status(201).json(
        {
        saida:sair
    });            
}

const statusVaga = async (req,res) => {
    const vaga = await model.statu(req.body);
    return res.status(201).json(vaga)
}

const calculoTempo = async (req,res) => {
    const vaga = req.body.placa;
    const tempo = await model.calculo(vaga);
    return res.status(201).json({
        Comprovante:tempo
    });
}

const MostrarComprovante = async (req, res) => {
    const comprovante = await model.MostrarComprovante(req.body.placa);

    return res.status(201).json(comprovante);
};

module.exports = { cadastrarClienteEVeiculo,
    cadastrarVaga,
    addVaga,
    saida,
    statusVaga,
    calculoTempo,
    MostrarComprovante


}