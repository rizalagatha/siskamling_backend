// src/services/laporan.service.js

const pool = require("../config/db");

/**
 * Service untuk mengecek status laporan APAR mingguan.
 */
async function getStatusMingguan(idUser) {
  try {
    const sql = `
            SELECT id_laporan 
            FROM laporan_apar_mingguan 
            WHERE id_user = ? AND waktu_lapor >= NOW() - INTERVAL 7 DAY
            LIMIT 1
        `;
    const [rows] = await pool.execute(sql, [idUser]);

    // Jika ada laporan dalam 7 hari terakhir, statusnya 'Sudah Cek'
    if (rows.length > 0) {
      return "Sudah Cek";
    } else {
      return "Perlu Cek";
    }
  } catch (error) {
    console.error("Database error in getStatusMingguan:", error);
    throw error;
  }
}

/**
 * Service untuk menyimpan laporan APAR mingguan (tanpa foto).
 */
async function createLaporan(data) {
  const { id_user, id_cabang, sudah_dibalik, ada_temuan, catatan } = data;
  try {
    const sql = `
            INSERT INTO laporan_apar_mingguan 
            (id_user, id_cabang, sudah_dibalik, ada_temuan, catatan) 
            VALUES (?, ?, ?, ?, ?)
        `;
    const [result] = await pool.execute(sql, [
      id_user,
      id_cabang,
      sudah_dibalik,
      ada_temuan,
      catatan,
    ]);
    return result.insertId;
  } catch (error) {
    console.error("Database error in createLaporan:", error);
    throw error;
  }
}

module.exports = {
  getStatusMingguan,
  createLaporan,
};
