// src/routes/titik.routes.js

const express = require('express');
const router = express.Router();
const titikController = require('../controllers/titik.controller');

// Endpoint: GET /api/titik/:id_cabang
// Contoh: /api/titik/1 akan mengambil semua titik untuk cabang dengan ID 1
router.get('/:id_cabang', titikController.handleGetTitikByCabang);

module.exports = router;
