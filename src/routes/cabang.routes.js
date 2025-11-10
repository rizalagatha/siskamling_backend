// src/routes/cabang.routes.js

const express = require('express');
const router = express.Router();
const cabangController = require('../controllers/cabang.controller.js');

// GET /api/cabang
router.get('/', cabangController.handleGetSemuaCabang);

module.exports = router;