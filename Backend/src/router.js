// Aquivo  de rotas

const express = require('express');
const router = express.Router();
const controle = require('./controle/controle');
const { put } = require('request');

//Rota Cadastrar Cliente/Veiculo
router.post('/Cadastro',controle.cadastrarClienteEVeiculo );

// Rota Cadastrar vagas
router.post('/vagas',controle.cadastrarVaga);

//Rota para ver vagas
router.get('/verVaga',controle.statos);

//Rota para add carro a uma vaga
router.put('/vagas',controle.addVaga);

module.exports = router;  