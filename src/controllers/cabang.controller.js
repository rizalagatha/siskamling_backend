// src/controllers/cabang.controller.js

const cabangService = require("../services/cabang.service");

/**
 * Controller untuk mengambil semua cabang.
 */
async function handleGetSemuaCabang(req, res) {
  try {
    const data = await cabangService.getSemuaCabang();
    res.status(200).json({ status: "success", data: data });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Gagal mengambil data cabang." });
  }
}

module.exports = {
  handleGetSemuaCabang,
};
