// src/routes/laporan.routes.js

const express = require("express");
const router = express.Router();
const laporanController = require("../controllers/laporan.controller");
const uploadLaporan = require("../middleware/uploadLaporan");

// Endpoint: GET /api/laporan/status-mingguan/:id_user
router.get(
  "/status-mingguan/:id_user",
  laporanController.handleGetStatusMingguan
);

// Endpoint: POST /api/laporan/apar-mingguan
router.post(
  "/apar-mingguan",
  uploadLaporan,
  laporanController.handleCreateLaporanMingguan
);

module.exports = router;
