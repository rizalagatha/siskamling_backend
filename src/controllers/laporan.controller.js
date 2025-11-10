// src/controllers/laporan.controller.js

const laporanService = require("../services/laporan.service");

async function handleGetStatusMingguan(req, res) {
  try {
    const { id_user } = req.params;
    if (!id_user) {
      return res.status(400).json({ message: "ID User dibutuhkan." });
    }
    const status = await laporanService.getStatusLaporanMingguan(id_user);
    res.status(200).json({ status: status });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
}

async function handleCreateLaporanMingguan(req, res) {
  try {
    const { id_user, id_cabang, sudah_dibalik, ada_temuan, catatan } = req.body;

    // Ambil nama file dari req.files (karena kita pakai upload.fields)
    const foto_selfie = req.files.selfie ? req.files.selfie[0].filename : null;
    const foto_bukti = req.files.foto_bukti
      ? req.files.foto_bukti[0].filename
      : null;

    if (
      !id_user ||
      !id_cabang ||
      !sudah_dibalik ||
      !foto_selfie ||
      ada_temuan === undefined
    ) {
      return res
        .status(400)
        .json({ status: "error", message: "Data laporan tidak lengkap." });
    }

    const result = await laporanService.createLaporanMingguan({
      id_user,
      id_cabang,
      sudah_dibalik: sudah_dibalik === "true",
      ada_temuan: ada_temuan === "true",
      catatan: catatan || null,
      foto_selfie,
      foto_bukti,
    });

    res.status(201).json({
      status: "success",
      message: "Laporan APAR mingguan berhasil disimpan.",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server.",
    });
  }
}

module.exports = {
  handleGetStatusMingguan,
  handleCreateLaporanMingguan,
};
