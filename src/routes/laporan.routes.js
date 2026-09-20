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

router.get("/saya/:id_user", laporanController.handleGetLaporanSaya);

// GET /api/laporan/checkpoint
router.get("/checkpoint", laporanController.handleGetLaporanCheckpoint);

// GET /api/laporan/apar
router.get("/apar", laporanController.handleGetLaporanApar);

// GET /api/laporan/kalender?bulan=2025-11&cabang=1&satpam=5
router.get("/kalender", laporanController.handleGetKalender);

// GET /api/laporan/kalender/detail?tanggal=2025-11-10&cabang=1&satpam=5
router.get("/kalender/detail", laporanController.handleGetKalenderDetail);

// GET /api/laporan/kalender/filter?cabang=1
router.get("/kalender/filter", laporanController.handleGetKalenderFilter);

module.exports = router;
