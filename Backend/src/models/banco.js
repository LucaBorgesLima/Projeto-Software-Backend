//conexao com banco de dados

const mysql = require('mysql2/promise');

const conexao = mysql.createPool({
    host : Process.env.MYSQL_HOST,
    user : Process.env.MYSQL_USER,
    password : Process.env.MYSQL_PASSWORD,
    data_base : process.env.MYSQL_DB
});

module.exports = conexao;