// routes/caseRoutes.js - Versão atualizada para usar o banco de dados

const express = require('express');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { createCase } = require('../models/case');
const dbPool = require('../db'); // <-- Importando nosso pool de conexões do db.js

const router = express.Router();

// ... (toda a configuração do multer continua igual) ...
const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'uploads/'); },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage: storage });


// Rota para listar todos os casos (lendo do banco de dados)
router.get('/cases', async (req, res) => {
  try {
    const sql = "SELECT * FROM cases ORDER BY created_at DESC";
    const [cases] = await dbPool.query(sql); // Executa a query
    res.json(cases);
  } catch (error) {
    console.error("Erro ao buscar casos:", error);
    res.status(500).json({ message: 'Erro ao buscar casos no servidor.' });
  }
});

// Rota para criar um novo caso (salvando no banco de dados)
// Em caseRoutes.js

router.post('/cases', upload.single('photo'), async (req, res) => {
  // Log 1: A rota foi acionada
  console.log("--> [POST /cases] Rota acionada. Verificando campos...");
  
  const { name, age, city, description } = req.body;

  if (!name || !age || !city || !description || !req.file) {
    return res.status(400).json({ message: 'Todos os campos, incluindo a foto, são obrigatórios.' });
  }

  console.log("--> [POST /cases] Campos validados. Entrando no bloco try.");

  try {
    // Log 2: Antes de chamar o Cloudinary
    console.log("--> [POST /cases] Passo 1: Fazendo upload para o Cloudinary...");
    const result = await cloudinary.uploader.upload(req.file.path);
    
    // Log 3: Depois de chamar o Cloudinary
    console.log("--> [POST /cases] Passo 1 CONCLUÍDO. Upload para Cloudinary OK.");

    const photoUrl = result.secure_url;
    const newCase = { name, age, city, description, photo: photoUrl }; // Usando o objeto diretamente

    const sql = "INSERT INTO cases (name, age, city, description, photo) VALUES (?, ?, ?, ?, ?)";
    const values = [newCase.name, newCase.age, newCase.city, newCase.description, newCase.photo];
    
    // Log 4: Antes de chamar o Banco de Dados
    console.log("--> [POST /cases] Passo 2: Preparado para inserir no banco de dados...");
    const [insertResult] = await dbPool.query(sql, values);
    
    // Log 5: Depois de chamar o Banco de Dados
    console.log("--> [POST /cases] Passo 2 CONCLUÍDO. Inserção no banco de dados OK. ID:", insertResult.insertId);

    // Log 6: Antes de enviar a resposta final
    console.log("--> [POST /cases] Enviando resposta de sucesso para o cliente...");
    res.status(201).json({ 
        message: 'Caso criado com sucesso!', 
        caseId: insertResult.insertId,
        newCase 
    });

  } catch (err) {
    // Log de Erro
    console.error("--> [POST /cases] ERRO no bloco try:", err);
    res.status(500).json({ message: 'Erro no servidor ao processar sua requisição.' });
  }
});

module.exports = router;