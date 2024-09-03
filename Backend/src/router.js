// Aquivo  de rotas

const express = require('express');
const router = express.Router();
const controle = require('./controle/controle')

//Rota para ver cadastro de Carro
router.get('/cadastros',controle.getCadastro_carros )

//rota para cadastar carros
router.post('/CadastrarCarro',controle.Postcadastro_carro)

// rota para cadastrar cliente 
router.post('/CadastrarCliente',controle.cadastrar_cliente)

module.exports = router;