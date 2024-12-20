// Aquivo  de rotas

const express = require('express');
const router = express.Router();
const controle = require('./controle/controle');
const { put } = require('request');

//Rota Cadastrar Cliente/Veiculo
router.post('/Cadastro',controle.cadastrarClienteEVeiculo );
   
// Rota Cadastrar vagas
router.post('/vaga',controle.cadastrarVaga);
            
//Rota para add carro a uma vaga 
router.put('/vagas',controle.addVaga);

//Rota para add o horario de saida do carro
router.put('/saida',controle.saida);   

//Mudar status da vaga para livre quando carro sair
router.put('/statusvaga',controle.statusVaga);

//Tempo de permanencia do carro 
router.post('/tempo', controle.calculoTempo);

//Mostrar comprovante
router.post('/vercomprovante', controle.MostrarComprovante);

//rota cancelar comprovante 
router.post('/cancelarcomprovante', controle.cancelarComprovante);   

//rota paga comprovante
router.put('/paga', controle.ComprovantePago);

    
   
module.exports = router;                                                