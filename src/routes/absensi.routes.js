// src/routes/absensi.routes.js

const express = require('express');
const router = express.Router();
const absensiController = require('../controllers/absensi.controller');
const uploadMiddleware = require('../middleware/upload'); // <-- Import middleware upload

// Terapkan middleware upload pada route POST
// Middleware akan berjalan sebelum controller.
// Ia akan memproses file 'selfie' dan menyiapkannya di req.file
router.post('/', uploadMiddleware, absensiController.handleCreateAbsensi);

module.exports = router;
