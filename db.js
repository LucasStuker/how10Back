// db.js - Nova configuração para MariaDB/MySQL

const mysql = require('mysql2');




// --- CÓDIGO DE DEPURAÇÃO TEMPORÁRIO ---
console.log("--- INICIANDO VERIFICAÇÃO DE VARIÁVEIS DE AMBIENTE ---");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
// NUNCA exiba a senha em logs, mas podemos verificar se ela existe
console.log("DB_PASSWORD está definida?", !!process.env.DB_PASSWORD); 
console.log("DB_DATABASE:", process.env.DB_DATABASE);
console.log("-----------------------------------------------------");
// --- FIM DO CÓDIGO DE DEPURAÇÃO ---



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