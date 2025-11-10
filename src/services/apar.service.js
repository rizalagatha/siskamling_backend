// src/services/apar.service.js

const pool = require("../config/db");

/**
 * Service untuk mengambil semua data APAR berdasarkan ID Cabang.
 * Termasuk status pengecekan 7 hari terakhir.
 */
async function getAparByCabang(idCabang) {
  try {
    // Query ini mengambil semua APAR dan menggabungkannya dengan
    // pengecekan terakhir (MAX(waktu_cek)).
    // CASE statement menentukan statusnya.
    const sql = `
            SELECT
                a.id_apar,
                a.id_cabang,
                a.nomor_apar,
                a.lokasi_apar,
                a.qr_code_data,
                MAX(la.waktu_cek) AS waktu_cek_terakhir,
                CASE
                    WHEN MAX(la.waktu_cek) IS NULL THEN 'Perlu Cek'
                    WHEN MAX(la.waktu_cek) < DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 'Perlu Cek'
                    ELSE 'Sudah Cek'
                END AS status_cek
            FROM apar a
            LEFT JOIN laporan_apar la ON a.id_apar = la.id_apar
            WHERE a.id_cabang = ?
            GROUP BY a.id_apar
            ORDER BY a.nomor_apar ASC
        `;

    const [rows] = await pool.execute(sql, [idCabang]);
    return rows;
  } catch (error) {
    console.error("Database error in getAparByCabang:", error);
    throw error;
  }
}

/**
 * Service untuk menyimpan laporan pengecekan APAR baru.
 */
async function createLaporanApar(data) {
  const {
    id_apar,
    id_user,
    status_dibalik,
    status_tekanan,
    status_segel,
    catatan,
    foto_bukti,
  } = data;

  try {
    const sql = `
            INSERT INTO laporan_apar
            (id_apar, id_user, status_dibalik, status_tekanan, status_segel, catatan, foto_bukti)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

    const [result] = await pool.execute(sql, [
      id_apar,
      id_user,
      status_dibalik,
      status_tekanan,
      status_segel,
      catatan,
      foto_bukti,
    ]);

    return result;
  } catch (error) {
    console.error("Database error in createLaporanApar:", error);
    throw error;
  }
}

module.exports = {
  getAparByCabang,
  createLaporanApar,
};
