// src/controllers/apar.controller.js

const aparService = require("../services/apar.service");

/**
 * Controller untuk mengambil daftar APAR berdasarkan cabang.
 */
async function handleGetAparByCabang(req, res) {
  try {
    const { id_cabang } = req.params;
    if (!id_cabang) {
      return res.status(400).json({ message: "ID Cabang dibutuhkan." });
    }
    const aparList = await aparService.getAparByCabang(id_cabang);
    res.status(200).json(aparList);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
}

/**
 * Controller untuk menyimpan laporan pengecekan APAR.
 */
async function handleCreateLaporanApar(req, res) {
  try {
    const {
      id_apar,
      id_user,
      status_dibalik,
      status_tekanan,
      status_segel,
      catatan,
    } = req.body;

    // Ambil nama file foto bukti (jika ada)
    const foto_bukti = req.file ? req.file.filename : null;

    // Validasi input dasar
    if (
      !id_apar ||
      !id_user ||
      !status_dibalik ||
      !status_tekanan ||
      !status_segel
    ) {
      return res
        .status(400)
        .json({ status: "error", message: "Data laporan tidak lengkap." });
    }

    const result = await aparService.createLaporanApar({
      id_apar,
      id_user,
      status_dibalik,
      status_tekanan,
      status_segel,
      catatan: catatan || null,
      foto_bukti,
    });

    res.status(201).json({
      status: "success",
      message: "Laporan APAR berhasil disimpan.",
      insertedId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server.",
    });
  }
}

module.exports = {
  handleGetAparByCabang,
  handleCreateLaporanApar,
};
