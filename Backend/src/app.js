// Configuração do app 

const express = require('express');
const router = require('./router');
const app = express();
const cors = require('cors');

app.use(cors());

app.use(express.json())

app.use(router);
    
 
module.exports = app;
          