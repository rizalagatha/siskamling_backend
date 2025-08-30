// src/services/titik.service.js

const pool = require('../config/db');

/**
 * Service untuk mengambil semua titik patroli berdasarkan ID Cabang.
 * @param {number} idCabang - ID dari cabang.
 * @returns {Promise<Array>} Daftar titik patroli.
 */
async function getTitikByCabang(idCabang) {
    try {
        const sql = `
  SELECT 
  id_titik,
  id_cabang,
  nama_titik,
  nomor_urut,
  CAST(latitude AS DECIMAL(10,8)) AS latitude,
  CAST(longitude AS DECIMAL(11,8)) AS longitude
FROM titik
WHERE id_cabang = ?
ORDER BY nomor_urut ASC;
`;
        const [rows] = await pool.execute(sql, [idCabang]);
        return rows;
    } catch (error) {
        console.error("Database error in getTitikByCabang:", error);
        throw error;
    }
}

module.exports = {
    getTitikByCabang
};
