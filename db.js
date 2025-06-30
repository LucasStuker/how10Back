
const mysql = require('mysql2');




console.log("--- INICIANDO VERIFICAÇÃO DE VARIÁVEIS DE AMBIENTE ---");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD está definida?", !!process.env.DB_PASSWORD); 
console.log("DB_DATABASE:", process.env.DB_DATABASE);
console.log("-----------------------------------------------------");



const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 4000,
  
  ssl: {
    ca: process.env.DB_SSL_CA 
  }
});

console.log('Pool de conexões para TiDB Cloud configurado com SSL.');

module.exports = pool.promise();