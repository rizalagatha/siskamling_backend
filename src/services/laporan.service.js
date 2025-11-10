// src/services/laporan.service.js

const pool = require("../config/db");

/**
 * Service untuk mengecek apakah user sudah lapor dalam 7 hari terakhir.
 */
async function getStatusLaporanMingguan(idUser) {
  try {
    const sql = `
            SELECT COUNT(*) as count 
            FROM laporan_apar_mingguan
            WHERE id_user = ? 
              AND waktu_lapor >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        `;
    const [rows] = await pool.execute(sql, [idUser]);

    // Jika count > 0, berarti sudah lapor
    return rows[0].count > 0 ? "Sudah Cek" : "Perlu Cek";
  } catch (error) {
    console.error("Database error in getStatusLaporanMingguan:", error);
    throw error;
  }
}

/**
 * Service untuk menyimpan laporan mingguan baru.
 */
async function createLaporanMingguan(data) {
  const {
    id_user,
    id_cabang,
    sudah_dibalik,
    ada_temuan,
    catatan,
    foto_selfie,
    foto_bukti,
  } = data;

  try {
    const sql = `
            INSERT INTO laporan_apar_mingguan
            (id_user, id_cabang, sudah_dibalik, ada_temuan, catatan, foto_selfie, foto_bukti)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

    const [result] = await pool.execute(sql, [
      id_user,
      id_cabang,
      sudah_dibalik,
      ada_temuan,
      catatan,
      foto_selfie,
      foto_bukti,
    ]);

    return result;
  } catch (error) {
    console.error("Database error in createLaporanMingguan:", error);
    throw error;
  }
}

module.exports = {
  getStatusLaporanMingguan,
  createLaporanMingguan,
};
