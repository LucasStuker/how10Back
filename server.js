
const express = require('express');
const cloudinary = require('cloudinary').v2;
const caseRoutes = require("./routes/caseRoutes");
const cors = require('cors')

console.log("--> Arquivo server.js iniciado.");

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log("--> Configuração do Cloudinary carregada.");

app.use(express.json());


app.get('/', (req, res) => {
  res.status(200).send('API do Encontrar-DB está no ar!');
});


app.use('/api', caseRoutes);
console.log("--> Rotas configuradas.");

console.log("--> Configurações carregadas. Tentando iniciar o servidor...");
app.listen(port, '0.0.0.0', () => { 
  console.log(`--> SERVIDOR INICIADO COM SUCESSO! Escutando na porta ${port}`);
});