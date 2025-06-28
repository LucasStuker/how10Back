// db.js - Nova configuração para MariaDB/MySQL

const mysql = require('mysql2');

// Cria o Pool lendo as informações das Variáveis de Ambiente
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 4000,
  
  // Configuração ESSENCIAL para o TiDB Cloud
  ssl: {
    ca: process.env.DB_SSL_CA 
  }
});

console.log('Pool de conexões para TiDB Cloud configurado com SSL.');

// Exportamos o pool com a API de Promises
module.exports = pool.promise();