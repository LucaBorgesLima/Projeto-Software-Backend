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
    console.log("Dados:",placa, cor, modelo,marca, cliente_idcliente )
    
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
const vaga = async (criar) => {
    const {numero} = criar;
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
const EntradaVaga = async (add) => {
    const { placa,numero } = add;
    const horario_entrada = formatDateForMySQL(new Date());

    //Busca placa do veiculo
    const buscarVeiculo = 'SELECT idveiculo FROM veiculo WHERE placa = ?';
    const [veiculo] = await banco.execute(buscarVeiculo, [placa]);

    if (veiculo.length === 0) {
        console.error('Erro  Veículo não encontrado');
        return;
    }

    const veiculo_idveiculo = veiculo[0].idveiculo;

    //Validar se o carro já está em uma vaga
    const ValidarCarro = 'SELECT numero FROM vaga WHERE placa = ? AND status = "ocupado"';
    const [ValidarQuery] = await banco.execute(ValidarCarro, [placa]);

    if (ValidarQuery.length > 0) {
        console.error('Erro Carro já está em uma vaga');
        return;
    }
   
    //Validar se a vaga está livre
    const validar = 'SELECT * FROM vaga WHERE numero = ?';
    const [validarVaga] = await banco.execute(validar, [numero]);

    if (validarVaga[0]?.status === 'Livre') {
        const status = 'ocupado';
        const queryUp = 'UPDATE vaga SET status = ?, horario_entrada = ?, placa = ?, veiculo_idveiculo = ? WHERE idvaga = ?';
   
        const [result] = await banco.execute(queryUp, [status, horario_entrada, placa, veiculo_idveiculo,numero]);

        return {
            Vaga : result,
            message: 'Veiculo na vaga com sucesso!'
        };
    } else {
        console.error('Erro Vaga não está livre ou nao existe');
    }
};

//Finalizar o uso da vaga do veiculo e mostra horario da saida do carro
const saida = async (vaga) => {
    const horario_saida = formatDateForMySQL(new Date()) ;
    const {idvaga} = vaga;

    //Validar existe carro na vaga 
    const ValidarVaga = 'SELECT  idvaga FROM vaga WHERE idvaga = ? AND veiculo_idveiculo IS NULL';
    const [ValidarQuery] = await banco.execute(ValidarVaga, [idvaga]);

    if (ValidarQuery.length > 0) {
        console.error('Erro nao tem carro nessa vaga')
        return;
    };

    const query = 'UPDATE vaga SET horario_saida = ?  WHERE idvaga = ?';
    const [result] = await banco.execute(query,[horario_saida,idvaga]);

    return {
        saida:result,
        message: 'Saida do Veiculo sucesso!'
    }; 
};

//Muda status da vaga quando fizer pagamento
const statu = async (muda) =>{
    const{idvaga}=muda;
    const status = 'livre';
    const horario_entrada = null;
    const horario_saida = null;
    const veiculo_idveiculo = null ;
    const placa = null;
    const query = 'UPDATE vaga SET status = ? ,horario_entrada = ? ,horario_saida = ?,veiculo_idveiculo = ? , placa = ?  WHERE idvaga = ?';
   
    const [result] = await banco.execute(query,[status,horario_entrada,horario_saida,veiculo_idveiculo,placa,idvaga])
   
    return result;
};   

//Funcao calculo/comprovante de uso
const calculo = async (vagaid)=>{

    const query = 'SELECT horario_entrada,horario_saida FROM vaga WHERE idvaga = ?';
    const [result] = await banco.execute(query, [vagaid]);

    //Validar se o carro ja saiu da vaga 
    const ValidarSaida = 'SELECT  idvaga FROM vaga WHERE idvaga = ? AND horario_saida IS NULL';
    const [ValidarQuery] = await banco.execute(ValidarSaida, [vagaid]);

    if (ValidarQuery.length > 0) {
        console.error('Erro carro ainda nao saiu da vaga')
        return;
    };

    const horario_entrada = result[0].horario_entrada;
    const horario_saida = result[0].horario_saida;

    const HorarioEntradaDate = new Date (horario_entrada);
    const HorarioSaidaDate = new Date (horario_saida);

    const TempoEstacionado = HorarioSaidaDate - HorarioEntradaDate;
    const horas = Math.floor(TempoEstacionado / (1000 * 60 * 60));
    const minutos = Math.floor((TempoEstacionado % (1000 * 60 * 60)) / (1000 * 60));

    const ValorMinuto = minutos * 0.50;
    const ValorHora = horas * 30 ;

    const ValorTotal = ValorHora + ValorMinuto

    //Add Info na tabela de orcamento
    const preco = ValorTotal;
    const data = formatDateForMySQL(new Date());
    const vaga_idvaga = vagaid;

    const into = 'INSERT INTO comprovante (preco,data,vaga_idvaga) VALUES (?,?,?)';
    const [AddOrcamento] = await banco.execute(into,[preco,data,vaga_idvaga]);
    const idorcamento = AddOrcamento.insertId;

    const MostrarDado = `
        SELECT ve.idveiculo, m.modelo, ve.placa, va.horario_entrada, va.horario_saida, c.preco
        FROM vaga va
        JOIN veiculo ve ON va.veiculo_idveiculo = ve.idveiculo
        JOIN modelo m ON ve.modelo_idmodelo = m.idmodelo
        JOIN comprovante c ON va.idvaga = c.vaga_idvaga
        WHERE c.idcomprovante = ?
    `;

    const [comprovante] = await banco.execute(MostrarDado, [idorcamento]);

    return{
        AddOrcamento,
        comprovante,
        Horas:horas.toString(),
        Minutos:minutos.toString()
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