// src/routes/laporan.routes.js

const express = require("express");
const router = express.Router();
const laporanController = require("../controllers/laporan.controller.js");

// Endpoint untuk mengecek status laporan mingguan
// GET /api/laporan/status/:id_user
router.get("/status/:id_user", laporanController.getStatus);

// Endpoint untuk mengirim laporan APAR (tanpa upload)
// POST /api/laporan/apar-mingguan
router.post("/apar-mingguan", laporanController.handleCreateLaporan);

module.exports = router;
