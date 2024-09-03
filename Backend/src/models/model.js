// Arquivo das funcoes 

//conexao com banco
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

module.exports = {
    Verdados,
    cadastro,
    cadastro_cliente
};