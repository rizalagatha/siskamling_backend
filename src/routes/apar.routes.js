// src/routes/apar.routes.js

const express = require("express");
const router = express.Router();
const aparController = require("../controllers/apar.controller");
const uploadApar = require("../middleware/uploadApar"); // Import middleware upload APAR

// Endpoint: GET /api/apar/:id_cabang
router.get("/:id_cabang", aparController.handleGetAparByCabang);

// Endpoint: POST /api/apar/lapor
// Middleware 'uploadApar' akan menangani file 'foto_bukti'
router.post("/lapor", uploadApar, aparController.handleCreateLaporanApar);

module.exports = router;
