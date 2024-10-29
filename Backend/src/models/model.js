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
    const { placa } = add;
    const horario_entrada = formatDateForMySQL(new Date());

    //Busca placa do veiculo
    const buscarVeiculo = 'SELECT idveiculo FROM veiculo WHERE placa = ?';
    const [veiculo] = await banco.execute(buscarVeiculo, [placa]);

    if (veiculo.length === 0) {
        console.err('Erro  Veículo não encontrado');
        return;
    } 

    const veiculo_idveiculo = veiculo[0].idveiculo;

    //Validar se o carro já está em uma vaga
    const ValidarCarro = 'SELECT placa FROM vaga WHERE placa = ? ';
    const [ValidarQuery] = await banco.execute(ValidarCarro, [placa]);

    if (ValidarQuery.length > 0) {
        console.err('Erro o carro ja esta estacionado ');
        return;
    }
   

    if (ValidarQuery.length === 0 ) {
        const queryUp = 'INSERT INTO vaga (horario_entrada,placa,veiculo_idveiculo) VALUES (?, ?, ?)';
   
        const [result] = await banco.execute(queryUp, [horario_entrada, placa, veiculo_idveiculo]);

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
    const horario_saida = formatDateForMySQL(new Date());
    const { placa } = vaga;

    //Validar existe carro na vaga 
    const ValidarVaga = 'SELECT * FROM vaga WHERE placa = ? AND veiculo_idveiculo IS NOT NULL';
    const [ValidarQuery] = await banco.execute(ValidarVaga, [placa]);

    if (ValidarQuery.length === 0) {
        console.error('Erro o carro nao esta estacionado')
        return;
    };

    //Validar se carro ja nao saiu
    const ValidarSaida = 'SELECT * FROM vaga WHERE horario_saida IS NOT NULL AND placa = ? ';
    const [Validar] = await banco.execute(ValidarSaida,[placa])

    if (Validar.length > 0) {
        console.error("Erro carro ja saiu")
        return;
    };

    const query = 'UPDATE vaga SET horario_saida = ?  WHERE placa = ?';
    const [result] = await banco.execute(query,[horario_saida,placa]);

    return {
        saida:result,
        message: 'Saida do Veiculo sucesso!'
    }; 
};

 

//Funcao calculo/comprovante de uso
const calculo = async (CarPlaca) => {

    const placa = CarPlaca;
    
    const query = 'SELECT horario_entrada,horario_saida,idvaga FROM vaga WHERE placa = ?';
    const [result] = await banco.execute(query, [placa]);
    if (result === 0) {
        console.error("Erro: nenhum carro se encontra")
    };

    const { horario_entrada, horario_saida, idvaga } = result[0];
    console.log('Horários e ID da vaga:', {
        horario_entrada,
        horario_saida,
        idvaga
    });

    //Validar se o carro ja saiu da vaga 
    if (!horario_saida) {
        console.error('Erro: O carro ainda não saiu da vaga.');
        return;
    };
    
    
    const HorarioEntradaDate = new Date (horario_entrada);
    const HorarioSaidaDate = new Date (horario_saida);

    const TempoEstacionado = HorarioSaidaDate - HorarioEntradaDate;
    const horas = Math.floor(TempoEstacionado / (1000 * 60 * 60));
    const minutos = Math.floor((TempoEstacionado % (1000 * 60 * 60)) / (1000 * 60));

    const ValorMinuto = minutos * 0.50;
    const ValorHora = horas * 30 ;

    const ValorTotal = ValorHora + ValorMinuto

    //Add Info na tabela de comprovante
    const preco = ValorTotal;
    const data = formatDateForMySQL(new Date());
    const vaga_idvaga = idvaga;

    const QueryComprovante = 'INSERT INTO comprovante (preco,data,vaga_idvaga,placa) VALUES (?,?,?,?)';
    const [resultComprovante] = await banco.execute(QueryComprovante,[preco,data,vaga_idvaga,placa]);
    
    return{
        preco:preco,
        Horas:horas.toString(),
        Minutos: minutos.toString(),
        result:resultComprovante
    }

};

const MostrarComprovante = async (PlacaComprovante) => {

    const placa = PlacaComprovante;

        const MostrarComprovante = "select ve.idveiculo,m.modelo,ve.placa,va.horario_entrada , va.horario_saida, c.preco from vaga va join veiculo ve on va.veiculo_idveiculo = ve.idveiculo join  modelo m on ve.modelo_idmodelo = m.idmodelo join comprovante c on va.idvaga = c.vaga_idvaga where c.placa = ? ;"

    const ResultQuery = await banco.query(MostrarComprovante, [placa]);
    console.log('foi mostrar comprovante'+ placa);
    

    return  ResultQuery[0]
    

};


 
          
module.exports = {  
    cliente,
    veiculo,
    statusVaga,
    EntradaVaga,
    saida,
    calculo,
    MostrarComprovante

};                                   