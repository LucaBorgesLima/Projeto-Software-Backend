// Arquivo das funcoes 

//conexao com banco
const { query } = require("express");
const banco = require("./banco");

// funcao que mostra todos os carros cadastrados no banco de dados e nome dos donos
const  Verdados = async () =>{
    const carros = await banco.execute('select c.nome, v.modelo, v.cor , v.placa ,c.telefone  from veiculos v  inner join clientes c on c.id_cliente = v.clientes_id_cliente ;');
    return carros[0] ;
};

//funcao para add cadastro de um carro no banco de dados 
const cadastro = async (carro) => {
    const {modelo,placa,cor,clientes_id_cliente} = carro;
    const query = 'INSERT INTO veiculos (modelo,cor,placa,clientes_id_cliente) VALUES (?,?,?,?)';
    const cadastrar = await banco.execute(query,[modelo,cor,placa,clientes_id_cliente]);
    return cadastrar [0];

};

//funcao para add cadastro de um cliente no banco de dados 
const cadastro_cliente = async (clientes) => {
    const {nome,telefone,email} = clientes;
    const query = 'INSERT INTO clientes (nome,telefone,email) VALUES (?,?,?)';
    const cadastrar_cliente = await banco.execute(query,[nome,telefone,email]);
    return cadastrar_cliente [0];

};

// Funcao para Add carro a uma vaga marcando horario 

const add_vaga = async (vagaAdd) => {
    const {vaga,placa,} = vagaAdd;
    const horario_entrada = new Date();
    const query = 'INSERT INTO registros (vaga, placa,horario_entrada) VALUES (?, ?, ?)'
    const add = await banco.execute(query,[vaga,placa,horario_entrada]);
    return add
};

// funcao para mostra horario da saida do carro 

const saida_vaga = async (saida) => {
    const {vaga,placa,} = saida;
    const horario_saida = new Date();
    const query =  'UPDATE registros SET horario_saida = ? WHERE numero_vaga = ? AND placa_veiculo = ? AND horario_saida IS NULL'
    const saida_carro = await banco.execute(query,[vaga,placa,horario_saida]);
    return saida_carro
}

module.exports = {
    Verdados,
    cadastro,
    cadastro_cliente,
    add_vaga,
    saida_vaga
};