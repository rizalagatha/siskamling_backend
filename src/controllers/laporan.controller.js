// src/controllers/laporan.controller.js

const laporanService = require("../services/laporan.service");

/**
 * Controller untuk mengecek status laporan mingguan.
 */
async function getStatus(req, res) {
  try {
    const { id_user } = req.params;
    const status = await laporanService.getStatusMingguan(id_user);
    res.status(200).json({
      status: "success",
      message: "Status berhasil diambil.",
      data: status,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Gagal mengambil status." });
  }
}

/**
 * Controller untuk membuat laporan APAR mingguan (tanpa foto).
 */
async function handleCreateLaporan(req, res) {
  try {
    // Data sekarang diambil dari req.body (JSON), bukan req.files
    const { id_user, id_cabang, sudah_dibalik, ada_temuan, catatan } = req.body;

    if (id_user == null || id_cabang == null || sudah_dibalik == null) {
      return res.status(400).json({
        status: "error",
        message: "Data (user, cabang, status dibalik) dibutuhkan.",
      });
    }

    const dataLaporan = {
      id_user,
      id_cabang,
      sudah_dibalik,
      ada_temuan: ada_temuan || false,
      catatan: catatan || null,
    };

    const insertedId = await laporanService.createLaporan(dataLaporan);

    res.status(201).json({
      status: "success",
      message: "Laporan APAR mingguan berhasil disimpan.",
      data: { id_laporan: insertedId },
    });
  } catch (error) {
    console.error("[Laporan APAR Controller Error]", error);
    res
      .status(500)
      .json({ status: "error", message: "Gagal menyimpan laporan." });
  }
}

/**
 * Controller untuk mengambil laporan checkpoint.
 * Menerima filter dari query string.
 */
async function handleGetLaporanCheckpoint(req, res) {
  try {
    const filters = {
      id_cabang: req.query.cabang, // ?cabang=1
      tanggal: req.query.tanggal, // ?tanggal=2025-11-10
    };
    const laporan = await laporanService.getLaporanCheckpoint(filters);
    res.status(200).json({ status: "success", data: laporan });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "error",
        message: "Gagal mengambil laporan checkpoint.",
      });
  }
}

/**
 * Controller untuk mengambil laporan APAR.
 */
async function handleGetLaporanApar(req, res) {
  try {
    const filters = {
      id_cabang: req.query.cabang,
      tanggal: req.query.tanggal,
    };
    const laporan = await laporanService.getLaporanApar(filters);
    res.status(200).json({ status: "success", data: laporan });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Gagal mengambil laporan APAR." });
  }
}

module.exports = {
  getStatus,
  handleCreateLaporan,
  handleGetLaporanCheckpoint, // <-- Ekspor fungsi baru
  handleGetLaporanApar, // <-- Ekspor fungsi baru
};
