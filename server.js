// server.js - Versão com mais logs e health check

const express = require('express');
const cloudinary = require('cloudinary').v2;
const caseRoutes = require("./routes/caseRoutes");

console.log("--> Arquivo server.js iniciado.");

const app = express();
// A porta é lida da variável de ambiente do Render, ou usa 5000 como padrão
const port = process.env.PORT || 5000;

// Configuração do Cloudinary
// É CRÍTICO que as variáveis de ambiente do Cloudinary existam aqui!
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log("--> Configuração do Cloudinary carregada.");

app.use(express.json());

// ROTA DE SAÚDE (HEALTH CHECK) - Adicione esta rota!
// O Render usa isso para saber se sua API está viva.
app.get('/', (req, res) => {
  res.status(200).send('API do Encontrar-DB está no ar!');
});

// Usando as rotas de casos
app.use('/api', caseRoutes);
console.log("--> Rotas configuradas.");

// Iniciando o servidor
console.log("--> Configurações carregadas. Tentando iniciar o servidor...");
app.listen(port, '0.0.0.0', () => { // Adicionado '0.0.0.0' por segurança
  console.log(`--> SERVIDOR INICIADO COM SUCESSO! Escutando na porta ${port}`);
});