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


router.get('/cases', async (req, res) => {
  try {
    const { search } = req.query;
    
    let sql = "SELECT * FROM cases";
    const params = [];

    if(search) {
      sql += " WHERE name LIKE ? OR city LIKE ?";
      params.push(`%${search}%`)
      params.push(`%${search}%`)
    }

    sql += " ORDER BY created_at DESC"; 

    const [cases] = await dbPool.query(sql,params)
    res.json(cases);

  } catch (error) {
    console.error("Erro ao buscar casos:", error);
    res.status(500).json({ message: 'Erro ao buscar casos no servidor.' });
  }
});

// Rota para criar um novo caso (salvando no banco de dados)
router.post('/cases', upload.single('photo'), async (req, res) => {
  const { name, age, city, description } = req.body;

  if (!name || !age || !city || !description || !req.file) {
    return res.status(400).json({ message: 'Todos os campos, incluindo a foto, são obrigatórios.' });
  }

  try {
    // 1. Upload para o Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    const photoUrl = result.secure_url;

    // 2. Cria o objeto do caso (seu model continua útil!)
    const newCase = createCase(name, age, city, description, photoUrl);

    // 3. Insere no banco de dados
    const sql = "INSERT INTO cases (name, age, city, description, photo) VALUES (?, ?, ?, ?, ?)";
    const values = [newCase.name, newCase.age, newCase.city, newCase.description, newCase.photo];
    
    const [insertResult] = await dbPool.query(sql, values);

    res.status(201).json({ 
        message: 'Caso criado com sucesso!', 
        caseId: insertResult.insertId, // Retorna o ID do novo caso
        newCase 
    });
    
  } catch (err) {
    console.error("Erro ao criar caso:", err);
    return res.status(500).json({ message: 'Erro no servidor ao processar sua requisição.'});
  }
});

module.exports = router;