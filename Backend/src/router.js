// Aquivo  de rotas

const express = require('express');
const router = express.Router();
const controle = require('./controle/cad_controle')

//Rota para ver os dos Cadastro Carro
router.get('/cadastros',controle.getCadastro_carros )

module.exports = router;