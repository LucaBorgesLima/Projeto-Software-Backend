//conexao com banco
const { query } = require("express");
const banco = require("./banco");
const { DATETIME } = require("mysql/lib/protocol/constants/types");



// Visualizar as Vagas e Status
const statusVaga = async () => {
    const queryStatus = 'SELECT * FROM vaga';
    const [result] = await banco.execute(queryStatus);
    return result
};

const BuscarVaga = async(idvaga) => {
    const query = 'SELECT * FROM vaga WHERE idvaga = ?'
    const [result] = await banco.execute(query,[idvaga]);

    return result
};


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

// Cria uma vaga Livre
const vaga = async (stato) => {
    const {numero} = stato;
    const status = 'Livre'

    const queryVaga = 'INSERT INTO vaga (numero,status) VALUES (?,?)'
    
    const [result] =await banco.execute(queryVaga,[numero,status]);

    return {idvaga:result.insertId,
        numero,
        status
    }; 
};


//muda forma data e hora para o padrao Mysql
const formatDateForMySQL = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0'); 
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

//Add carro a vaga e marca horario de entrada
const EntradaVaga = async (add) =>{
    const {veiculo_idveiculo,idvaga} = add;
    const horario_entrada = formatDateForMySQL(new Date());
    const status = 'ocupado';

    //verificar se tem a vaga
    const vagaExiste = await BuscarVaga(idvaga);
    if(!vagaExiste) {
        throw new Error('Vaga Nao existe');
    };

    const queryUp = 'UPDATE vaga SET status = ? ,horario_entrada = ? ,veiculo_idveiculo = ? WHERE idvaga = ?';

    const[result] = await banco.execute(queryUp,[status,horario_entrada,veiculo_idveiculo,idvaga]);
    
    return result;
};

//Finalizar o uso da vaga do veiculo e mostra horario da saida do carro
const saida = async (vaga) => {
    const horario_saida = formatDateForMySQL(new Date()) ;
    const {idvaga} = vaga;

    const query = 'UPDATE vaga SET horario_saida = ?  WHERE idvaga = ?';

    const [result] = await banco.execute(query,[horario_saida,idvaga]);

    return result;
};


//Muda status da vaga quando fizer pagamento
const statu = async (muda) =>{
    const{idvaga}=muda;
    const status = 'livre';
    const horario_entrada = null;
    const horario_saida = null;
    const veiculo_idveiculo = null ;
    const query = 'UPDATE vaga SET status = ? ,horario_entrada = ? ,horario_saida = ?,veiculo_idveiculo = ?  WHERE idvaga = ?';

    const [result] = await banco.execute(query,[status,horario_entrada,horario_saida,veiculo_idveiculo,idvaga])

    return result;
}; 


//Funcao para fazer calculo de tempo
const calculo = async (vagaid)=>{

    console.log("vagaid:",vagaid);

    const query = 'SELECT horario_entrada,horario_saida FROM vaga WHERE idvaga = ?';
    const [result] = await banco.query(query, [vagaid]);
    console.log('Resultado da consulta:', result);

    const horario_entrada = result[0].horario_entrada;
    const horario_saida = result[0].horario_saida;

    const HorarioEntradaDate = new Date (horario_entrada);
    const HorarioSaidaDate = new Date (horario_saida);

    const TempoEstacionado = HorarioSaidaDate - HorarioEntradaDate;
    const horas = Math.floor(TempoEstacionado / (1000 * 60 * 60));
    const minutos = Math.floor((TempoEstacionado % (1000 * 60 * 60)) / (1000 * 60));

    return{
        vagaid,
        horarioEntrada: HorarioEntradaDate.toLocaleString(),
        horarioSaida: HorarioSaidaDate.toLocaleString(),
        tempoEstacionado: `${horas} horas e ${minutos} minutos`
    }

}; 


          
module.exports = {
    cliente,
    veiculo,
    vaga,
    statusVaga,
    EntradaVaga,
    saida,
    statu,
    calculo
};                               