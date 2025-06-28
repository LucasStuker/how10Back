const express = require('express');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const caseRoutes = require("./routes/caseRoutes");  // Usando a rota de casos

const app = express();
const port = 5000;

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: 'dizlfpifc',
  api_key: '499276362846554',
  api_secret: 'e-c-JPjAskNI9KOKl6I7AUAE_jQ',
});

app.use(express.json());

// Usando as rotas de casos
app.use('/api', caseRoutes);

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
