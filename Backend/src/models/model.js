// Arquivo das funcoes 

//conexao com banco
const { query } = require("express");
const banco = require("./banco");
const { DATETIME } = require("mysql/lib/protocol/constants/types");

//HTTP GET

// Visualizar as Vagas e Status
const statosVaga = async () => {
    const queryStatus = 'SELECT * FROM vaga';
    const [result] = await banco.execute(queryStatus);
    return result
};

////////////////////////////////////////////////////////////////////////////////////////

//HTTP POST

//Cadatro Cliente 
const cliente = async (pessoa) => {
    const { nome, telefone } = pessoa;
    const query = 'INSERT INTO cliente (nome, telefone) VALUES (?, ?)';
    const [result] = await banco.execute(query, [nome, telefone]); 
        
    return { idcliente: result.insertId, nome, telefone }; 
};

//Cadastro Veiculo
const veiculo = async (car) => {
    const { placa, cor, modelo, marca, cliente_idcliente } = car;
    
    // Inserir marca e obter o idmarca
    const queryMarca = 'INSERT INTO marca (marca) VALUES (?) ON DUPLICATE KEY UPDATE idmarca=LAST_INSERT_ID(idmarca)';
    const [resultMarca] = await banco.execute(queryMarca, [marca]);
    const idmarca = resultMarca.insertId;  
    
    // Inserir modelo com o idmarca associado e obter idmodelo
    const queryModelo = 'INSERT INTO modelo (modelo, marca_idmarca) VALUES (?, ?) ON DUPLICATE KEY UPDATE idmodelo=LAST_INSERT_ID(idmodelo)';
    const [resultModelo] = await banco.execute(queryModelo, [modelo, idmarca]);
    const idmodelo = resultModelo.insertId;
    
    // Inserir veículo com idmodelo e cliente_idcliente
    const queryVeiculo = 'INSERT INTO veiculo (placa, cor, cliente_idcliente, modelo_idmodelo) VALUES (?, ?, ?, ?)';
    const [resultVeiculo] = await banco.execute(queryVeiculo, [placa, cor, cliente_idcliente, idmodelo]);
    
    return {
        veiculo: resultVeiculo,
        modelo: resultModelo,
        marca: resultMarca};
};

// Cadastro Veiculo a Vaga 
const vaga = async (stato) => {
    const {numero,status} = stato;

    const queryVaga = 'INSERT INTO vaga (numero,status) VALUES (?,?)'
    
    const [result] =await banco.execute(queryVaga,[numero,status]);

    return {idvaga:result.insertId,
        numero,
        status
    }; 
};

// HTTP PUT

const BuscarVaga = async(idvaga) => {
    const query = 'SELECT * FROM vaga WHERE idvaga = ?'
    const [result] = await banco.execute(query,[idvaga]);

    return result
};

const EntradaVaga = async (add) =>{
    const {status,veiculo_idveiculo,idvaga} = add;
    const horario_entrada = new Date().toISOString().slice(0,19).replace('T',' ');

    //verificar se tem a vaga
    const vagaExiste = await BuscarVaga(idvaga);
    if(!vagaExiste) {
        throw new Error('Vaga Nao existe');
    };

    const queryUp = 'UPDATE vaga SET status = ? ,horario_entrada = ? ,veiculo_idveiculo = ? WHERE idvaga = ?';

    const[result] = await banco.execute(queryUp,[status,horario_entrada,veiculo_idveiculo,idvaga]);

    return result;
};



// Adicionar Veiculo a uma vaga

module.exports = {
    cliente,
    veiculo,
    vaga,
    statosVaga,
    EntradaVaga
};