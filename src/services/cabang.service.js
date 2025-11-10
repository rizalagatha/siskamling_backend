// src/services/cabang.service.js

const pool = require("../config/db");

/**
 * Service untuk mengambil semua data cabang.
 */
async function getSemuaCabang() {
  try {
    const sql =
      "SELECT id_cabang, nama_cabang, kode_cabang FROM cabang ORDER BY nama_cabang ASC";
    const [rows] = await pool.execute(sql);
    return rows;
  } catch (error) {
    console.error("Database error in getSemuaCabang:", error);
    throw error;
  }
}

module.exports = {
  getSemuaCabang,
};
